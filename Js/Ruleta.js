// Ruleta rusa: cilindro de 6 recámaras con 1 bala.
// Cada disparo seguro multiplica el saldo con el que empezó la ronda (x1.5, x2, ... x3.5).
// Si sale la bala, el saldo se multiplica por 0. Usa el mismo saldo simulado que el blackjack.
const LIMITE = 10000;
const RECAMARAS = 6;
const PASO = 360 / RECAMARAS;       // 60° entre recámaras
const MAX_SEGUROS = RECAMARAS - 1;  // el sexto disparo sería bala segura

let idCuenta = localStorage.getItem("sesion"); // null = invitado (se juega sin créditos)
let saldo = 0;
let saldoListo = false;
let juego = null;

const mesa = document.getElementById("mesa-ruleta");
const capa = document.getElementById("capa");
const mira = document.getElementById("mira");
const simbolo = document.getElementById("simbolo");
const mensaje = document.getElementById("mensaje");
const recamaras = document.querySelectorAll(".recamara");

function mostrarMensaje(texto) {
    mensaje.innerText = texto;
}

// Número aleatorio entero entre 0 y n-1
function azar(n) {
    return crypto.getRandomValues(new Uint32Array(1))[0] % n;
}

async function cargarSaldo() {
    if (idCuenta === null) return;
    try {
        let cuenta = null;
        const datosGuardados = localStorage.getItem("cuenta_activa");
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            if (String(datos.id) === String(idCuenta)) cuenta = datos;
        }

        if (!cuenta) {
            let respuesta = await fetch("Json/Cuentas.json");
            if (!respuesta.ok) respuesta = await fetch("Cuentas.json");
            if (!respuesta.ok) throw new Error("No se encontró Cuentas.json");
            const cuentas = await respuesta.json();
            cuenta = cuentas.find(c => String(c.id) === String(idCuenta));
            if (cuenta) localStorage.setItem("cuenta_activa", JSON.stringify(cuenta));
        }
        if (!cuenta) throw new Error("La sesión no corresponde a una cuenta");

        const guardado = localStorage.getItem("creditos_" + idCuenta);
        saldo = guardado === null ? Number(cuenta.creditos) : Number(guardado);
        if (!Number.isFinite(saldo) || saldo < 0 || saldo > LIMITE) {
            throw new Error("El saldo guardado no es válido");
        }
        saldoListo = true;
        actualizarSaldo();
    } catch (error) {
        saldoListo = false;
        console.error("Error al cargar la cuenta:", error);
    }
}

function actualizarSaldo() {
    document.getElementById("saldo").innerText = saldo;
}

function guardarSaldo() {
    localStorage.setItem("creditos_" + idCuenta, saldo);
    actualizarSaldo();
    window.dispatchEvent(new Event("saldo-actualizado"));
}

class RuletaRusa {
    #fase;          // colocar -> colocando -> girando -> disparos -> fin
    #angulo;        // giro actual del cilindro
    #recamaraBala;  // recámara elegida por el usuario
    #posBala;       // posición de la bala respecto al indicador, después del giro
    #seguros;       // disparos seguros hechos en la ronda
    #mult;          // multiplicador actual
    #base;          // saldo con el que empezó la ronda
    #frame;
    #ultimo;
    #ocupado;

    constructor() {
        this.reiniciar();
    }

    get fase() { return this.#fase; }

    #setFase(fase) {
        this.#fase = fase;
        mesa.dataset.fase = fase;
    }

    #bloquear(valor) {
        this.#ocupado = valor;
        document.getElementById("disparar").disabled = valor;
        document.getElementById("desistir").disabled = valor;
    }

    #sinTransicion(elemento, valor) {
        elemento.style.transition = "none";
        elemento.style.transform = valor;
        elemento.offsetHeight; // fuerza el repintado
        elemento.style.transition = "";
    }

    #actualizarPanel() {
        document.getElementById("multiplicador").innerText = "x" + this.#mult;
        const terminado = this.#fase === "fin" || this.#seguros >= MAX_SEGUROS;
        document.getElementById("siguiente").innerText = terminado ? "-" : "x" + (1 + 0.5 * (this.#seguros + 1));
    }

    reiniciar() {
        cancelAnimationFrame(this.#frame);
        this.#angulo = 0;
        this.#seguros = 0;
        this.#mult = 1;
        this.#recamaraBala = null;
        this.#posBala = null;
        this.#bloquear(false);
        capa.style.transform = "rotate(0deg)";
        this.#sinTransicion(mira, "rotate(0deg)");
        recamaras.forEach(r => r.classList.remove("con-bala"));
        simbolo.classList.remove("visible");
        this.#setFase("colocar");
        this.#actualizarPanel();
        if (idCuenta !== null && !(saldoListo && saldo > 0)) {
            mostrarMensaje(saldoListo ? "No tienes créditos para jugar." : "No se pudo cargar tu cuenta.");
        } else {
            mostrarMensaje(idCuenta === null
                ? "Modo invitado: juegas sin créditos. Elige la recámara donde irá la bala."
                : "Elige la recámara donde irá la bala.");
        }
    }

    colocar(pos) {
        if (this.#fase !== "colocar") return;
        if (idCuenta !== null && !(saldoListo && saldo > 0)) return;
        this.#recamaraBala = pos;
        this.#base = saldo;
        recamaras[pos].classList.add("con-bala");
        this.#setFase("colocando");
        mostrarMensaje("Bala colocada. Se oculta y el cilindro empieza a girar...");
        setTimeout(() => this.#girar(), 900);
    }

    #girar() {
        this.#setFase("girando");
        mostrarMensaje("¡El cilindro gira! Presiona Detener cuando quieras.");
        this.#ultimo = performance.now();
        const vuelta = (t) => {
            this.#angulo = (this.#angulo + Math.max(0, t - this.#ultimo) * 1.4) % 360; // unas 4 vueltas por segundo
            this.#ultimo = t;
            capa.style.transform = `rotate(${this.#angulo}deg)`;
            this.#frame = requestAnimationFrame(vuelta);
        };
        this.#frame = requestAnimationFrame(vuelta);
    }

    detener() {
        if (this.#fase !== "girando") return;
        cancelAnimationFrame(this.#frame);
        // La posición final es aleatoria y no depende del momento del clic
        const k = azar(RECAMARAS);
        this.#angulo = k * PASO;
        capa.style.transform = `rotate(${this.#angulo}deg)`;
        this.#posBala = (this.#recamaraBala + k) % RECAMARAS;
        this.#setFase("disparos");
        mesa.classList.add("freno");
        setTimeout(() => mesa.classList.remove("freno"), 250);
        mostrarMensaje("El cilindro se detuvo. ¿Disparas o desistes?");
    }

    disparar() {
        if (this.#fase !== "disparos" || this.#ocupado) return;
        this.#bloquear(true);

        if (this.#seguros === this.#posBala) {
            this.#perder();
            return;
        }

        this.#seguros++;
        this.#mult = 1 + 0.5 * this.#seguros;
        if (idCuenta !== null) {
            saldo = Math.min(LIMITE, Math.round(this.#base * this.#mult * 100) / 100);
            guardarSaldo();
        }
        this.#actualizarPanel();
        mostrarMensaje(idCuenta !== null
            ? `¡Recámara vacía! Tu saldo ahora es ${saldo} (x${this.#mult}).`
            : `¡Recámara vacía! Multiplicador x${this.#mult}.`);

        this.#mostrarSimbolo("Imagenes/simbolo_dinero.png", 900, () => {
            if (this.#seguros >= MAX_SEGUROS) {
                this.#setFase("fin");
                this.#actualizarPanel();
                mostrarMensaje(`¡Sobreviviste a las ${MAX_SEGUROS} recámaras vacías! La bala era la última. La ronda termina.`);
                return;
            }
            mira.style.transform = `rotate(${this.#seguros * PASO}deg)`; // siguiente recámara, en sentido horario
            this.#bloquear(false);
        });
    }

    #perder() {
        if (idCuenta !== null) {
            saldo = 0;
            guardarSaldo();
        }
        this.#mult = 0;
        this.#mostrarSimbolo("Imagenes/calavera.png", 0);
        this.#setFase("fin");
        this.#actualizarPanel();
        mostrarMensaje("¡Bang! La bala estaba en esa recámara. Multiplicador x0: perdiste todo.");
    }

    desistir() {
        if (this.#fase !== "disparos" || this.#ocupado) return;
        const conservado = saldo;
        this.reiniciar();
        mostrarMensaje(idCuenta !== null
            ? `Desististe y conservas ${conservado} créditos. Coloca la bala para otra ronda.`
            : "Desististe. Coloca la bala para otra ronda.");
    }

    #mostrarSimbolo(ruta, ms, despues) {
        simbolo.src = ruta;
        simbolo.classList.remove("visible");
        simbolo.offsetHeight; // reinicia la animación
        simbolo.classList.add("visible");
        if (ms > 0) {
            setTimeout(() => {
                simbolo.classList.remove("visible");
                if (despues) despues();
            }, ms);
        }
    }
}

recamaras.forEach(r => r.addEventListener("click", () => { if (juego) juego.colocar(Number(r.dataset.pos)); }));
document.getElementById("detener").addEventListener("click", () => { if (juego) juego.detener(); });
document.getElementById("disparar").addEventListener("click", () => { if (juego) juego.disparar(); });
document.getElementById("desistir").addEventListener("click", () => { if (juego) juego.desistir(); });
document.getElementById("reiniciar").addEventListener("click", () => { if (juego) juego.reiniciar(); });

// Sincronizar cuando el administrador modifica sus créditos desde el menú (solo fuera de una ronda)
window.addEventListener("saldo-actualizado", function() {
    if (juego && (juego.fase === "colocar" || juego.fase === "fin") && idCuenta !== null) {
        const guardado = localStorage.getItem("creditos_" + idCuenta);
        if (guardado !== null) {
            saldo = Number(guardado);
            actualizarSaldo();
        }
    }
});

cargarSaldo().then(() => { juego = new RuletaRusa(); });

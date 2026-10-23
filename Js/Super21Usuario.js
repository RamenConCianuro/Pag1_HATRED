//cartas
class Card{
    #val;
    #pinta; 

    constructor(val, pinta){
        this.#val = val;
        this.#pinta = pinta; 
    }
    getVal(){ return this.#val; }
    getPinta(){  return this.#pinta; }
    getValNumeric(){
        if(isNaN(this.#val)){ // A, J, Q, K
            if (this.#val === "A") return 11;
            return 10;
        }
        return parseInt(this.#val);
    }
    isAce(){ return this.#val === "A"; }
    getImageCode(){ return `${this.#val}-${this.#pinta}`; }
}

//crar los mazos 
class CreateCards{
    #baraja; 

    constructor(){
        this.#baraja = []; 
        this.buildMazo(); 
    }

    buildMazo(){
        const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        const pintas = ["C", "D", "H", "S"];
        this.#baraja = []; 

        for(let pi of pintas){
            for(let v of values){
                this.#baraja.push(new Card(v, pi));

            }
        }
    }

    /*ver(){
        for(let i = 0; i < this.#baraja.length; i++){
            console.log(this.#baraja[i]);
        }
    }*/

    desordenarMazo(){
        for(let i = 0; i < this.#baraja.length; i++){
            let j = Math.floor(Math.random() * this.#baraja.length);
            let temp = this.#baraja[i];
            this.#baraja[i] = this.#baraja[j];
            this.#baraja[j] = temp;
        }
    }

    popCard(){
        return this.#baraja.pop();
    }
}

class Player{
    #nombre;
    #mano;
    #score;
    #aceCount;

    constructor(nombre){
        this.#nombre = nombre;
        this.#mano = [];
        this.#score = 0;
        this.#aceCount = 0;
    }
    getNombre(){ return this.#nombre; }
    getMano(){ return this.#mano; }
    getScore(){ return this.#score; }
    getAceCount(){ return this.#aceCount; }
    addCard(card){
        this.#mano.push(card);
        this.#score += card.getValNumeric();
        if (card.isAce()) {
            this.#aceCount += 1;
        }
    }
    getAdjustedScore(){
        let currentScore = this.#score;
        let currentAces = this.#aceCount;
        while (currentScore > 21 && currentAces > 0) {
            currentScore -= 10;
            currentAces -= 1;
        }
        return currentScore;
    }
}

// Blackjack para usuarios con créditos
let idCuenta = localStorage.getItem("sesion");
let saldo = 0;
let apuesta = 0;
let juego = null;
const LIMITE = 10000;

async function cargarSaldo() {
    const mensaje = document.getElementById("error-apuesta");
    const boton = document.querySelector("#form-apuesta button");
    boton.disabled = true;
    mensaje.innerText = "Cargando cuenta...";

    try {
        if (idCuenta === null) throw new Error("No hay una sesión iniciada");

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

        actualizarSaldo();
        mensaje.innerText = "";
        boton.disabled = false;
    } catch (error) {
        mensaje.innerText = error.message;
        console.error("Error al cargar la cuenta:", error);
    }
}

function actualizarSaldo() {
    document.getElementById("saldo").innerText = saldo;
    document.getElementById("saldo-final").innerText = saldo;
}

function guardarSaldo() {
    localStorage.setItem("creditos_" + idCuenta, saldo);
    actualizarSaldo();
    window.dispatchEvent(new Event("saldo-actualizado"));
}

function apostar(evento) {
    evento.preventDefault();
    let monto = Number(document.getElementById("monto-apuesta").value);
    if (!Number.isInteger(monto) || monto <= 0 || monto > saldo) {
        document.getElementById("error-apuesta").innerText = "Ingresa una apuesta válida que no supere tu saldo";
        return;
    }
    apuesta = monto;
    saldo -= apuesta;
    guardarSaldo();
    document.getElementById("error-apuesta").innerText = "";
    document.documentElement.classList.add("en-partida");
    document.documentElement.classList.remove("partida-terminada");
    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("player-cards").innerHTML = "";
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("player-sum").innerText = "";
    document.getElementById("resultadoss").style.display = "none";
    document.getElementById("pedir").disabled = false;
    document.getElementById("plantar").disabled = false;
    juego = new BlackjackUsuario();
    juego.start();
}

function terminarPartida(resultado) {
    if (resultado === "ganar") saldo += apuesta * 1.5;
    if (resultado === "empatar") saldo += apuesta;
    saldo = Math.min(LIMITE, saldo);
    // Permitir medios créditos cuando la apuesta es impar
    saldo = Math.round(saldo * 100) / 100;
    guardarSaldo();
    document.getElementById("pedir").disabled = true;
    document.getElementById("plantar").disabled = true;
    document.documentElement.classList.remove("en-partida");
    document.documentElement.classList.add("partida-terminada");
    const textos = {ganar:"¡Ganaste!", empatar:"¡Empate!", perder:"¡Perdiste!"};
    let cuadro = document.getElementById("resultadoss");
    cuadro.innerText = textos[resultado];
    cuadro.style.display = "block";
    apuesta = 0;
}

class BlackjackUsuario {
    #deck;
    #dealer;
    #player;
    #hiddenCard;
    #hiddenImgElement;
    #terminado;

    constructor() {
        this.#deck = new CreateCards();
        this.#dealer = new Player("Dealer");
        this.#player = new Player("Jugador");
        this.#terminado = false;
    }

    start() {
        this.#deck.desordenarMazo();
        this.#hiddenCard = this.#deck.popCard();
        this.#dealer.addCard(this.#hiddenCard);
        this.#hiddenImgElement = document.createElement("img");
        this.#hiddenImgElement.src = "Imagenes/cards/BACK.png";
        document.getElementById("dealer-cards").append(this.#hiddenImgElement);
        let carta = this.#deck.popCard();
        this.#dealer.addCard(carta);
        this.renderCard("dealer-cards", carta);
        for (let i = 0; i < 2; i++) {
            carta = this.#deck.popCard();
            this.#player.addCard(carta);
            this.renderCard("player-cards", carta);
        }
        document.getElementById("player-sum").innerText = this.#player.getAdjustedScore();
    }

    hit() {
        if (this.#terminado) return;
        let carta = this.#deck.popCard();
        this.#player.addCard(carta);
        this.renderCard("player-cards", carta);
        let puntos = this.#player.getAdjustedScore();
        document.getElementById("player-sum").innerText = puntos;
        if (puntos > 21) {
            this.#terminado = true;
            terminarPartida("perder");
        }
    }

    stay() {
        if (this.#terminado) return;
        this.#terminado = true;
        this.#hiddenImgElement.src = "Imagenes/cards/" + this.#hiddenCard.getImageCode() + ".png";
        while (this.#dealer.getAdjustedScore() < 17) {
            let carta = this.#deck.popCard();
            this.#dealer.addCard(carta);
            this.renderCard("dealer-cards", carta);
        }
        let jugador = this.#player.getAdjustedScore();
        let dealer = this.#dealer.getAdjustedScore();
        document.getElementById("dealer-sum").innerText = dealer;
        if (dealer > 21 || jugador > dealer) terminarPartida("ganar");
        else if (jugador === dealer) terminarPartida("empatar");
        else terminarPartida("perder");
    }

    renderCard(id, carta) {
        let imagen = document.createElement("img");
        imagen.src = "Imagenes/cards/" + carta.getImageCode() + ".png";
        document.getElementById(id).append(imagen);
    }
}

document.getElementById("form-apuesta").addEventListener("submit", apostar);
document.getElementById("pedir").addEventListener("click", () => { if (juego) juego.hit(); });
document.getElementById("plantar").addEventListener("click", () => { if (juego) juego.stay(); });
document.getElementById("otra-partida").addEventListener("click", () => {
    document.documentElement.classList.remove("partida-terminada");
    document.getElementById("monto-apuesta").value = "";
    juego = null;
});
cargarSaldo();

// Sincronizar cuando el administrador modifica sus créditos desde el menú
window.addEventListener("saldo-actualizado", function() {
    if (!document.documentElement.classList.contains("en-partida")) {
        let guardado = localStorage.getItem("creditos_" + idCuenta);
        if (guardado !== null) {
            saldo = Number(guardado);
            actualizarSaldo();
        }
    }
});

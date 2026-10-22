function cuentaInicio() {
    return {
        cuenta: null,
        creditos: 0,
        nuevoSaldo: "",
        mensaje: "",
        cargando: true,
        mostrarMenu: false,

        async cargarCuenta() {
            let id = localStorage.getItem("sesion");

            if (id !== null) {
                try {
                    let guardada = localStorage.getItem("cuenta_activa");
                    if (guardada) {
                        let datos = JSON.parse(guardada);
                        if (String(datos.id) === id) this.cuenta = datos;
                    }
                    if (!this.cuenta) {
                        let respuesta = await fetch("Json/Cuentas.json");
                        if (!respuesta.ok) respuesta = await fetch("Cuentas.json");
                        if (!respuesta.ok) throw new Error("No se pudo cargar");
                        const cuentas = await respuesta.json();
                        this.cuenta = cuentas.find(c => String(c.id) === id) || null;
                        if (this.cuenta) localStorage.setItem("cuenta_activa", JSON.stringify(this.cuenta));
                    }

                    if (this.cuenta) {
                        let saldoGuardado = localStorage.getItem("creditos_" + id);
                        if (saldoGuardado === null) {
                            this.creditos = this.cuenta.creditos;
                        } else {
                            this.creditos = Number(saldoGuardado);
                        }
                    }
                } catch (error) {
                    this.mensaje = "Error al cargar la cuenta";
                }
            }
            this.cargando = false;
        },

        actualizarCreditos() {
            if (this.cuenta) {
                let guardado = localStorage.getItem("creditos_" + this.cuenta.id);
                if (guardado !== null) this.creditos = Number(guardado);
            }
        },

        modificarSaldo() {
            if (!this.cuenta || this.cuenta.tipo !== "admin") return;

            let saldo = Number(this.nuevoSaldo);
            if (this.nuevoSaldo === "" || !Number.isInteger(saldo) || saldo < 0 || saldo > 10000) {
                this.mensaje = "Ingresa un saldo entre 0 y 10000";
                return;
            }

            this.creditos = saldo;
            localStorage.setItem("creditos_" + this.cuenta.id, saldo);
            window.dispatchEvent(new Event("saldo-actualizado"));
            this.mensaje = "Saldo actualizado";
            this.nuevoSaldo = "";
        },

        cerrarSesion() {
            localStorage.removeItem("sesion");
            localStorage.removeItem("cuenta_activa");
            window.location.href = "index.html";
        }
    };
}

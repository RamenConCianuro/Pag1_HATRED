function login() {
    return {
        usuario: "",
        clave: "",
        cuentas: [],
        mensaje: "",
        cargando: true,

        async cargarCuentas() {
            try {
                let respuesta = await fetch("Json/Cuentas.json");
                if (!respuesta.ok) respuesta = await fetch("Cuentas.json");

                if (!respuesta.ok) {
                    throw new Error("Error al cargar");
                }

                this.cuentas = await respuesta.json();
            } catch (error) {
                this.mensaje = "Error al cargar las cuentas";
            }

            this.cargando = false;
        },

        iniciarSesion() {
            if (this.cargando) {
                this.mensaje = "Cargando cuentas";
                return;
            }

            if (this.usuario.trim() === "" || this.clave === "") {
                this.mensaje = "Completa el usuario y la contraseña";
                return;
            }

            let cuenta = this.cuentas.find(c =>
                c.usuario === this.usuario.trim() && c.clave === this.clave
            );

            if (cuenta) {
                localStorage.setItem("sesion", cuenta.id);
                localStorage.setItem("cuenta_activa", JSON.stringify(cuenta));
                if (localStorage.getItem("creditos_" + cuenta.id) === null) {
                    localStorage.setItem("creditos_" + cuenta.id, cuenta.creditos);
                }
                window.location.href = "index.html";
            } else {
                this.mensaje = "Usuario o contraseña incorrectos";
            }
        }
    };
}

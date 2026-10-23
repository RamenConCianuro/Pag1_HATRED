function catalogo() {
    return {
        juegos: [],
        busqueda: '',
        cargando: true,
        error: false,
        mostrarResultados: false,

        async cargarJuegos() {
            try {
                const respuesta = await fetch('Json/Catalogo.json');

                if (!respuesta.ok) {
                    throw new Error('Error de carga');
                }

                this.juegos = await respuesta.json();
            } catch (error) {
                this.error = true;
            }

            this.cargando = false;
        },

        get juegosFiltrados() {
            let resultados = [];
            let texto = this.busqueda.toLowerCase().trim();

            for (let i = 0; i < this.juegos.length; i++) {
                for (let j = 0; j < this.juegos[i].nombres.length; j++) {
                    if (this.juegos[i].nombres[j].toLowerCase().includes(texto)) {
                        resultados.push(this.juegos[i]);
                        break;
                    }
                }
            }

            return resultados;
        }
    };
}

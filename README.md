#Esquilax Bet

Esquilax Bet es un prototipo de página web con temática de casino y apuestas. El proyecto cuenta con una página principal desde la cual el usuario puede acceder al juego Super 21 (Blackjack) y a la Ruleta Rusa, además de interfaces para iniciar sesión y crear una cuenta.

Actualmente, el proyecto está desarrollado principalmente en el lado del cliente. Las pantallas de inicio de sesión y registro corresponden a la interfaz visual y todavía no cuentan con persistencia de usuarios, base de datos ni manejo real de fondos.

Ip elastica: 35.171.31.215

#Tecnologías utilizadas

-HTML5: estructura de las distintas páginas del sitio.
-CSS3: diseño visual, distribución de elementos, barra de navegación y ambientación con temática de casino.
-JavaScript: navegación entre páginas, interacción con menús y funcionamiento de los juegos Super 21 y Ruleta Rusa.
-Git y GitHub: control de versiones y trabajo mediante ramas.

El proyecto utiliza HTML, CSS y JavaScript nativo, sin frameworks externos.

#Estructura general de carpetas

Pag1_HATRED/
    Front.html
    BlackJack.html
    Ruleta.html
    Login.html
    SignIn.html
    README.md

    Css/
        Front.css
        Sesion.css
        Super21.css
        Ruleta.css

    Js/
        Front.js
        Sesion.js
        Super21.js
        Ruleta.js

    Imagenes/
        background.png
        blackjackicon.jpg
        house-door-fill.svg
        person-circle.svg
        bala.png
        calavera.png
        cilindro_revolver.png
        simbolo_dinero.png
        cards/
            BACK.png
            imágenes de las cartas utilizadas por Super 21


##Descripción de la estructura

-Front.html: página principal de Esquilax Bet.
-BlackJack.html: interfaz del juego Super 21.
-Ruleta.html: interfaz del juego Ruleta Rusa.
-Login.html: formulario de inicio de sesión.
-SignIn.html: formulario de creación de cuenta.
-Css/: contiene los estilos de las distintas páginas.
-Js/: contiene la lógica e interacciones desarrolladas en JavaScript.
-Imagenes/: contiene el fondo, iconos, imagen principal del juego, las imágenes de la baraja y las imágenes de la Ruleta Rusa (cilindro, bala, calavera y símbolo de dinero).

#Principales funcionalidades

Página principal:

La página principal funciona como punto de entrada al sitio e incluye:

-Barra de navegación con acceso al inicio.
-Botones para acceder a las páginas de inicio de sesión y creación de cuenta.
-Icono de usuario con un menú desplegable.
-Acceso al juego Super 21 mediante una imagen utilizada como botón.
-Acceso a la Ruleta Rusa mediante una tarjeta con imagen y botón para jugar.
-Diseño inspirado en un casino, utilizando tonos verde oscuro, dorado, negro y rojo.

Inicio de sesión y creación de cuenta:

El proyecto incluye páginas separadas para:

-Iniciar sesión, ingresando correo y contraseña.
-Crear una cuenta, ingresando correo y contraseña.
-Volver a la página principal.

Por el momento, estos formularios corresponden al front-end y no almacenan ni validan usuarios mediante un servidor o una base de datos.

Menú de usuario:

El icono de usuario de la barra permite mostrar u ocultar un pequeño menú mediante JavaScript. Actualmente informa que es necesario iniciar sesión para acceder a la cuenta.

La estructura está preparada para que posteriormente este espacio pueda mostrar información del usuario, saldo u otras opciones relacionadas con la cuenta.

Super 21 / Blackjack:

El proyecto incorpora un juego funcional de Super 21 desarrollado en JavaScript.

Entre sus funciones se encuentran:

Creación de una baraja de 52 cartas.
Mezcla aleatoria de la baraja.
Reparto inicial de cartas al jugador y al dealer.
Carta oculta del dealer.
Cálculo automático del valor de cada mano.
Tratamiento del As como 11 o 1 dependiendo del puntaje.
Opción Pedir para recibir una nueva carta.
Opción Plantar para terminar el turno del jugador.
El dealer solicita cartas automáticamente mientras tenga menos de 17 puntos.
Comparación de puntajes para determinar victoria, derrota o empate.
Visualización de las cartas mediante imágenes.
Presentación del resultado de la partida en pantalla.

Ruleta Rusa:

El proyecto incorpora un juego funcional de Ruleta Rusa desarrollado en JavaScript.

Entre sus funciones se encuentran:

Revólver con un cilindro de 6 recámaras y una sola bala.
Elección por parte del usuario de la recámara donde se coloca la bala.
Ocultamiento de la bala y giro del cilindro a alta velocidad.
Opción Detener para frenar el cilindro de forma brusca; la posición final de la bala es aleatoria.
El cilindro se gira una sola vez por ronda; después solo se puede elegir entre Disparar o Desistir.
Opción Disparar para efectuar el disparo de la recámara actual.
Indicador de la recámara actual, que avanza a la siguiente en sentido horario después de cada disparo seguro.
Símbolo de dinero cuando la recámara está vacía y símbolo de calavera cuando el disparo contiene la bala.
Multiplicador del saldo con cada disparo seguro: x1.5, x2, x2.5, x3 y x3.5 (hasta el disparo 5), calculado sobre el saldo con el que comenzó la ronda.
Si el disparo contiene la bala, el saldo se multiplica por 0 y se pierde todo.
Opción Desistir para conservar lo ganado y reiniciar el juego; hay que colocar la bala nuevamente.
Término automático de la ronda al sobrevivir los 5 disparos seguros, ya que la última recámara contiene la bala.
Actualización del saldo simulado de la cuenta después de cada disparo, con un máximo de 10000 créditos.
Modo invitado: sin iniciar sesión se puede jugar, pero sin créditos.
Reglamento desplegable y presentación del resultado de la partida en pantalla.

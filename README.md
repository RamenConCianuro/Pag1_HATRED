#Esquilax Bet

Esquilax Bet es un prototipo de página web con temática de casino y apuestas. El proyecto cuenta con una página principal desde la cual el usuario puede acceder al juego Super 21 (Blackjack), además de interfaces para iniciar sesión y crear una cuenta.

Actualmente, el proyecto está desarrollado principalmente en el lado del cliente. Las pantallas de inicio de sesión y registro corresponden a la interfaz visual y todavía no cuentan con persistencia de usuarios, base de datos ni manejo real de fondos.

#Tecnologías utilizadas

-HTML5: estructura de las distintas páginas del sitio.
-CSS3: diseño visual, distribución de elementos, barra de navegación y ambientación con temática de casino.
-JavaScript: navegación entre páginas, interacción con menús y funcionamiento del juego Super 21.
-Git y GitHub: control de versiones y trabajo mediante ramas.

El proyecto utiliza HTML, CSS y JavaScript nativo, sin frameworks externos.

#Estructura general de carpetas

Pag1_HATRED/
    Front.html
    BlackJack.html
    Login.html
    SignIn.html
    README.md

    Css/
        Front.css
        Sesion.css
        Super21.css

    Js/
        Front.js
        Sesion.js
        Super21.js

    Imagenes/
        background.png
        blackjackicon.jpg
        house-door-fill.svg
        person-circle.svg
        cards/
            BACK.png
            imágenes de las cartas utilizadas por Super 21


##Descripción de la estructura

-Front.html: página principal de Esquilax Bet.
-BlackJack.html: interfaz del juego Super 21.
-Login.html: formulario de inicio de sesión.
-SignIn.html: formulario de creación de cuenta.
-Css/: contiene los estilos de las distintas páginas.
-Js/: contiene la lógica e interacciones desarrolladas en JavaScript.
-Imagenes/: contiene el fondo, iconos, imagen principal del juego y las imágenes de la baraja.

#Principales funcionalidades

Página principal:

La página principal funciona como punto de entrada al sitio e incluye:

-Barra de navegación con acceso al inicio.
-Botones para acceder a las páginas de inicio de sesión y creación de cuenta.
-Icono de usuario con un menú desplegable.
-Acceso al juego Super 21 mediante una imagen utilizada como botón.
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


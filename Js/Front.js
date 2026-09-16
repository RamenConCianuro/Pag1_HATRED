const home = document.getElementById("Home");
home.addEventListener("click", function(){
    window.location.href = "Front.html";
});
const login = document.getElementById("Login");
login.addEventListener("click", function(){
    window.location.href = "Login.html";
});
const signin = document.getElementById("Sign In");
signin.addEventListener("click", function(){
    window.location.href = "SignIn.html";
});
const cuenta = document.getElementById("Cuenta");
const usuario = document.getElementById("Usuario");
cuenta.addEventListener("click", function(){
    usuario.classList.toggle("mostrar");
});
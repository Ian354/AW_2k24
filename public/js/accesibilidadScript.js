document.addEventListener("DOMContentLoaded", function () {
    console.log("Accesibilidad script cargado");

    // Cambiar a modo claro
    document.getElementById("modoClaro").addEventListener("click", function () {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    });

    // Cambiar a modo oscuro
    document.getElementById("modoOscuro").addEventListener("click", function () {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    });

    // Cambiar a letra grande
    document.getElementById("letraGrande").addEventListener("click", function () {
        document.body.style.fontSize = "18px";
        localStorage.setItem("fontSize", "18px");
    });

    // Cambiar a letra pequeña
    document.getElementById("letraPequeña").addEventListener("click", function () {
        document.body.style.fontSize = "14px";
        localStorage.setItem("fontSize", "14px");
    });

    // Restaurar configuraciones guardadas
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        console.log("Modo oscuro restaurado");
    }
    if (localStorage.getItem("fontSize")) {
        document.body.style.fontSize = localStorage.getItem("fontSize");
        console.log("Tamaño de fuente restaurado");
    }
});

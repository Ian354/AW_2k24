document.addEventListener('DOMContentLoaded', () => {
    // Modo Oscuro
    const modoClaroBtn = document.getElementById('modoClaro');
    const modoOscuroBtn = document.getElementById('modoOscuro');
    const body = document.body;

    // Cambiar tamaño de letra
    const letraGrandeBtn = document.getElementById('letraGrande');
    const letraPequenaBtn = document.getElementById('letraPequeña');

    // Elementos afectados
    const titleElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6'); // Para títulos
    const contentElements = document.querySelectorAll('p, a, span, div, .accordion-button, .accordion-body'); // Para contenido general
    const eventosTitles = document.querySelectorAll('.accordion-header, .accordion-body'); // Acordeones

    // Función: Activar modo oscuro
    const activarModoOscuro = () => {
        body.classList.add('dark-mode');
        localStorage.setItem('modoOscuro', 'true');
    };

    // Función: Activar modo claro
    const activarModoClaro = () => {
        body.classList.remove('dark-mode');
        localStorage.setItem('modoOscuro', 'false');
    };

    // Listeners para modo oscuro
    if (modoClaroBtn) {
        modoClaroBtn.addEventListener('click', activarModoClaro);
    }
    if (modoOscuroBtn) {
        modoOscuroBtn.addEventListener('click', activarModoOscuro);
    }

    // Aplicar preferencias de modo oscuro
    if (localStorage.getItem('modoOscuro') === 'true') {
        activarModoOscuro();
    }

    // Función: Cambiar tamaño de letra a grande
    const activarLetraGrande = () => {
        titleElements.forEach(el => el.style.fontSize = '1.8rem'); // Más grande para títulos
        contentElements.forEach(el => el.style.fontSize = '1.2rem'); // Más grande para contenido general
        eventosTitles.forEach(el => el.style.fontSize = '1.5rem'); // Ajuste acordeones
        localStorage.setItem('letraGrande', 'true');
    };

    // Función: Cambiar tamaño de letra a pequeña (default más grande de lo habitual)
    const activarLetraPequena = () => {
        titleElements.forEach(el => el.style.fontSize = '1.5rem'); // Default ajustado
        contentElements.forEach(el => el.style.fontSize = '1rem'); // Default ajustado
        eventosTitles.forEach(el => el.style.fontSize = '1.2rem'); // Ajuste acordeones
        localStorage.setItem('letraGrande', 'false');
    };

    // Listeners para tamaño de letra
    if (letraGrandeBtn) {
        letraGrandeBtn.addEventListener('click', activarLetraGrande);
    }
    if (letraPequenaBtn) {
        letraPequenaBtn.addEventListener('click', activarLetraPequena);
    }

    // Aplicar preferencias de letra
    if (localStorage.getItem('letraGrande') === 'true') {
        activarLetraGrande();
    } else {
        activarLetraPequena();
    }
});

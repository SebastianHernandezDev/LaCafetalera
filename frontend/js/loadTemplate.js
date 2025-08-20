function loadTemplate(id, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Ejecuta el callback si existe
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch(err => console.error(`Error cargando ${url}:`, err));
}

// Envuelve tus llamadas en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    loadTemplate("navbar-container", "frontend/components/components-global/navbar.html");
    loadTemplate("footer-container", "frontend/components/components-global/footer.html");
});

// O al final del body, justo antes de </body>


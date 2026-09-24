document.addEventListener("DOMContentLoaded", function () {

    /* --- Menú de navegación responsivo (hamburguesa) --- */
    var boton = document.getElementById("menuToggle");
    var nav = document.getElementById("navPrincipal");

    if (boton && nav) {
        boton.addEventListener("click", function () {
            var abierto = nav.classList.toggle("abierto");
            // Actualiza el estado de accesibilidad
            boton.setAttribute("aria-expanded", abierto ? "true" : "false");
        });
    }

    var botonesFiltro = document.querySelectorAll(".filtro");
    var tickets = document.querySelectorAll(".ticket");
    var columnas = document.querySelectorAll(".kanban .columna");

    var seleccion = { categoria: "todas", prioridad: "todas" };

    function aplicarFiltros() {
        tickets.forEach(function (ticket) {
            var coincideCategoria = (seleccion.categoria === "todas" ||
                ticket.dataset.categoria === seleccion.categoria);
            var coincidePrioridad = (seleccion.prioridad === "todas" ||
                ticket.dataset.prioridad === seleccion.prioridad);

            if (coincideCategoria && coincidePrioridad) {
                ticket.classList.remove("oculto");
            } else {
                ticket.classList.add("oculto");
            }
        });

        mostrarColumnasVacias();
    }

    function mostrarColumnasVacias() {
        columnas.forEach(function (columna) {
            var visibles = columna.querySelectorAll(".ticket:not(.oculto)");
            var aviso = columna.querySelector(".columna__vacio");

            if (visibles.length === 0) {
                if (!aviso) {
                    aviso = document.createElement("p");
                    aviso.className = "columna__vacio";
                    aviso.textContent = "Sin tickets";
                    columna.appendChild(aviso);
                }
            } else if (aviso) {
                aviso.remove();
            }
        });
    }

    botonesFiltro.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var tipo = btn.dataset.tipo;   
            var valor = btn.dataset.valor;  

            seleccion[tipo] = valor;

            document.querySelectorAll('.filtro[data-tipo="' + tipo + '"]')
                .forEach(function (b) { b.classList.remove("activo"); });
            btn.classList.add("activo");

            aplicarFiltros();
        });
    });

});

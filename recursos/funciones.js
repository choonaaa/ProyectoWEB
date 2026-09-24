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

    /* --- Filtros del tablero Kanban --- */
    var botonesFiltro = document.querySelectorAll(".filtro");
    var tickets = document.querySelectorAll(".ticket");
    var columnas = document.querySelectorAll(".kanban .columna");

    // Filtros actualmente seleccionados (por defecto, todos)
    var seleccion = { categoria: "todas", prioridad: "todas" };

    // Aplica la selección: muestra u oculta cada ticket
    function aplicarFiltros() {
        tickets.forEach(function (ticket) {
            var coincideCategoria = (seleccion.categoria === "todas" ||
                ticket.dataset.categoria === seleccion.categoria);
            var coincidePrioridad = (seleccion.prioridad === "todas" ||
                ticket.dataset.prioridad === seleccion.prioridad);

            // Se muestra solo si coincide con ambos filtros
            if (coincideCategoria && coincidePrioridad) {
                ticket.classList.remove("oculto");
            } else {
                ticket.classList.add("oculto");
            }
        });

        mostrarColumnasVacias();
    }

    // Muestra un aviso en las columnas que quedaron sin tickets visibles
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

    // Al hacer clic en un filtro
    botonesFiltro.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var tipo = btn.dataset.tipo;    // "categoria" o "prioridad"
            var valor = btn.dataset.valor;  // "hardware", "alta", "todas"...

            // Guarda la selección de ese grupo
            seleccion[tipo] = valor;

            // Marca como activo solo el botón elegido dentro de su grupo
            document.querySelectorAll('.filtro[data-tipo="' + tipo + '"]')
                .forEach(function (b) { b.classList.remove("activo"); });
            btn.classList.add("activo");

            aplicarFiltros();
        });
    });

});

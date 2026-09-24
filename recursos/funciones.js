/* ============================================================
   HelpDesk IT — Script de comportamiento
   Proyecto Integrador · Programación Web I · UCES

   En la Fase 1 el sitio es estructural. Este archivo incluye
   una única interacción base (el menú responsivo). La lógica
   completa del tablero Kanban y del formulario se desarrolla
   en la Fase 2.
   ============================================================ */

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

});

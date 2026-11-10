/* ============================================================
   HelpDesk IT — Lógica de interactividad (Vanilla JS)
   Proyecto Integrador · Programación Web I · UCES — Fase 3

   Buenas prácticas (Sección I):
   - Script externo, cargado antes de </body>.
   - Sin manejadores inline (onclick, onsubmit...): todo con
     addEventListener.
   - Carga diferida: toda la inicialización corre en el evento
     'load', garantizando que el DOM esté completo.
   ============================================================ */

window.addEventListener("load", iniciar);

function iniciar() {
    initMenuMovil();     // 1. Menú táctil móvil
    initValidacion();    // 2. Validación visual del formulario
    initTablero();       // 3. Módulo de lógica: Mini-Kanban
}


/* ============================================================
   1. MENÚ TÁCTIL MÓVIL
   Alterna una clase CSS para mostrar/ocultar el menú en móvil.
   ============================================================ */
function initMenuMovil() {
    var boton = document.getElementById("menuToggle");
    var nav = document.getElementById("navPrincipal");
    if (!boton || !nav) return;

    boton.addEventListener("click", function () {
        var abierto = nav.classList.toggle("abierto");
        boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
}


/* ============================================================
   2. VALIDACIÓN VISUAL DEL FORMULARIO EN TIEMPO REAL
   Escucha los eventos 'input'/'change' de cada campo. Si el dato
   es inválido o está vacío, aplica un estilo de error; lo quita
   automáticamente en cuanto el usuario corrige la entrada.
   ============================================================ */
function initValidacion() {
    var formulario = document.querySelector(".formulario");
    if (!formulario) return;

    // Todos los campos que se deben validar
    var campos = formulario.querySelectorAll("input, select, textarea");

    campos.forEach(function (campo) {
        // 'input' para texto que se escribe; 'change' para selects
        campo.addEventListener("input", function () { validarCampo(campo); });
        campo.addEventListener("change", function () { validarCampo(campo); });
    });

    // Al enviar: valida todo y evita el envío si hay errores
    formulario.addEventListener("submit", function (evento) {
        var hayError = false;
        campos.forEach(function (campo) {
            if (!validarCampo(campo)) hayError = true;
        });

        if (hayError) {
            evento.preventDefault(); // No envía si algo está mal
            mostrarMensaje(formulario, "Revisá los campos marcados en rojo.", "error");
        } else {
            evento.preventDefault(); // Sitio estático: guardamos en el navegador
            var nuevo = crearTicketDesdeFormulario();
            mostrarMensaje(formulario,
                "¡Ticket " + nuevo.id + " creado! Lo vas a ver en el Tablero, en la columna \"Nuevo\".",
                "ok");
            formulario.reset();
            // Limpia los estilos de validación tras resetear
            campos.forEach(function (campo) {
                campo.classList.remove("campo-ok", "campo-error");
            });
        }
    });
}

// Toma los datos del formulario, crea el ticket y lo guarda en localStorage
function crearTicketDesdeFormulario() {
    var lista = cargarTickets();

    var nuevo = {
        id: generarId(lista),
        titulo: document.getElementById("descripcion").value.trim(),
        categoria: document.getElementById("categoria").value,
        prioridad: document.getElementById("prioridad").value,
        estado: "nuevo" // Todo ticket nuevo entra en la primera columna
    };

    lista.push(nuevo);

    try {
        localStorage.setItem(CLAVE_TICKETS, JSON.stringify(lista));
    } catch (e) { /* localStorage no disponible */ }

    return nuevo;
}

// Valida un campo y aplica el color correspondiente. Devuelve true si es válido.
function validarCampo(campo) {
    // Los campos opcionales vacíos no se marcan
    var opcionalVacio = !campo.required && campo.value.trim() === "";

    if (campo.checkValidity() || opcionalVacio) {
        campo.classList.remove("campo-error");
        // Solo marca en verde si el usuario escribió algo
        if (campo.value.trim() !== "") {
            campo.classList.add("campo-ok");
        } else {
            campo.classList.remove("campo-ok");
        }
        return true;
    } else {
        campo.classList.add("campo-error");
        campo.classList.remove("campo-ok");
        return false;
    }
}

// Muestra un mensaje de éxito o error debajo del formulario
function mostrarMensaje(formulario, texto, tipo) {
    var aviso = formulario.querySelector(".aviso-form");
    if (!aviso) {
        aviso = document.createElement("p");
        aviso.className = "aviso-form";
        formulario.appendChild(aviso);
    }
    aviso.textContent = texto;
    aviso.classList.remove("aviso-form--ok", "aviso-form--error");
    aviso.classList.add(tipo === "ok" ? "aviso-form--ok" : "aviso-form--error");
}


/* ============================================================
   3. MÓDULO DE LÓGICA: MINI-KANBAN DE TICKETS
   - Los tickets viven en un ARREGLO DE OBJETOS.
   - Una función del DOM los RENDERIZA como tarjetas, con color
     según su prioridad.
   - Se pueden MOVER entre columnas (Nuevo → En Progreso → Resuelto).
   - Filtros (categoría/prioridad) y búsqueda por texto (bucle for).
   ============================================================ */

// Tickets de ejemplo iniciales (se cargan la primera vez)
var ticketsBase = [
    { id: "TK-001", titulo: "La impresora de contaduría no responde", categoria: "hardware", prioridad: "alta",  estado: "nuevo" },
    { id: "TK-002", titulo: "Solicitud de acceso al sistema de ventas", categoria: "accesos",  prioridad: "media", estado: "nuevo" },
    { id: "TK-003", titulo: "El correo no envía adjuntos grandes",      categoria: "software",  prioridad: "baja",  estado: "nuevo" },
    { id: "TK-004", titulo: "Sin conexión a internet en el piso 2",     categoria: "redes",     prioridad: "alta",  estado: "progreso" },
    { id: "TK-005", titulo: "Instalación de planilla de cálculo",       categoria: "software",  prioridad: "baja",  estado: "progreso" },
    { id: "TK-006", titulo: "Cambio de mouse defectuoso",               categoria: "hardware",  prioridad: "baja",  estado: "resuelto" },
    { id: "TK-007", titulo: "Restablecer contraseña de usuario",        categoria: "accesos",   prioridad: "media", estado: "resuelto" }
];

// Clave usada para guardar los tickets en el navegador (localStorage)
var CLAVE_TICKETS = "helpdesk_tickets";

// Arreglo de objetos: el "modelo" de datos del tablero (se llena desde localStorage)
var tickets = [];

// Lee los tickets guardados; si no hay, usa los de ejemplo
function cargarTickets() {
    try {
        var guardado = localStorage.getItem(CLAVE_TICKETS);
        if (guardado) { return JSON.parse(guardado); }
    } catch (e) { /* localStorage no disponible */ }
    return ticketsBase.slice(); // copia de los iniciales
}

// Guarda el arreglo actual de tickets en el navegador
function guardarTickets() {
    try {
        localStorage.setItem(CLAVE_TICKETS, JSON.stringify(tickets));
    } catch (e) { /* localStorage no disponible */ }
}

// Genera el próximo ID (ej: TK-008) a partir del mayor existente
function generarId(lista) {
    var max = 0;
    for (var i = 0; i < lista.length; i++) {
        var n = parseInt(lista[i].id.replace("TK-", ""), 10);
        if (!isNaN(n) && n > max) { max = n; }
    }
    var num = max + 1;
    return "TK-" + ("00" + num).slice(-3); // rellena a 3 dígitos
}

// Orden de los estados para mover las tarjetas
var ESTADOS = ["nuevo", "progreso", "resuelto"];

// Filtro y búsqueda actualmente activos
var seleccion = { categoria: "todas", prioridad: "todas" };
var textoBusqueda = "";

function initTablero() {
    var kanban = document.querySelector(".kanban");
    if (!kanban) return; // No estamos en tablero.html

    tickets = cargarTickets(); // Carga los tickets guardados (o los de ejemplo)

    // Filtros laterales
    var botonesFiltro = document.querySelectorAll(".filtro");
    botonesFiltro.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var tipo = btn.dataset.tipo;
            seleccion[tipo] = btn.dataset.valor;

            // Marca como activo solo el botón elegido de su grupo
            document.querySelectorAll('.filtro[data-tipo="' + tipo + '"]')
                .forEach(function (b) { b.classList.remove("activo"); });
            btn.classList.add("activo");

            renderTablero();
        });
    });

    // Búsqueda por texto en tiempo real
    var buscador = document.getElementById("buscar");
    if (buscador) {
        buscador.addEventListener("input", function () {
            textoBusqueda = buscador.value.toLowerCase().trim();
            renderTablero();
        });
    }
    // Evita que el form de búsqueda recargue la página
    var formBusqueda = document.querySelector(".busqueda");
    if (formBusqueda) {
        formBusqueda.addEventListener("submit", function (e) { e.preventDefault(); });
    }

    renderTablero(); // Primer dibujado
}

// Decide si un ticket pasa los filtros y la búsqueda actuales
function pasaFiltros(ticket) {
    var okCategoria = (seleccion.categoria === "todas" || ticket.categoria === seleccion.categoria);
    var okPrioridad = (seleccion.prioridad === "todas" || ticket.prioridad === seleccion.prioridad);

    // Búsqueda: recorre el texto con un bucle (coincidencia en id, título o categoría)
    var okTexto = true;
    if (textoBusqueda !== "") {
        var textoTicket = (ticket.id + " " + ticket.titulo + " " + ticket.categoria).toLowerCase();
        okTexto = textoTicket.indexOf(textoBusqueda) !== -1;
    }
    return okCategoria && okPrioridad && okTexto;
}

// Renderiza TODO el tablero a partir del arreglo de objetos
function renderTablero() {
    // Recorre cada columna (estado) con un bucle for
    for (var i = 0; i < ESTADOS.length; i++) {
        var estado = ESTADOS[i];
        var lista = document.querySelector('.columna__lista[data-estado="' + estado + '"]');
        lista.innerHTML = ""; // Limpia antes de volver a dibujar

        var visibles = 0;

        // Recorre todos los tickets y dibuja los de este estado que pasen el filtro
        for (var j = 0; j < tickets.length; j++) {
            var ticket = tickets[j];
            if (ticket.estado === estado && pasaFiltros(ticket)) {
                lista.appendChild(crearTarjeta(ticket));
                visibles++;
            }
        }

        // Mensaje si la columna quedó vacía
        if (visibles === 0) {
            var vacio = document.createElement("p");
            vacio.className = "columna__vacio";
            vacio.textContent = "Sin tickets";
            lista.appendChild(vacio);
        }
    }
}

// Crea el elemento DOM de una tarjeta de ticket
function crearTarjeta(ticket) {
    var art = document.createElement("article");
    art.className = "ticket";

    // Nombre legible de la prioridad
    var nombrePrioridad = ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1);

    // Contenido de la tarjeta (color de etiqueta según prioridad)
    art.innerHTML =
        '<h3 class="ticket__id">#' + ticket.id + '</h3>' +
        '<p class="ticket__titulo">' + ticket.titulo + '</p>' +
        '<p class="ticket__meta">' +
            '<span class="etiqueta etiqueta--' + ticket.prioridad + '">' + nombrePrioridad + '</span> ' +
            capitalizar(ticket.categoria) +
        '</p>';

    // Botones para mover la tarjeta entre columnas
    var acciones = document.createElement("div");
    acciones.className = "ticket__acciones";

    var indice = ESTADOS.indexOf(ticket.estado);

    var btnAtras = document.createElement("button");
    btnAtras.type = "button";
    btnAtras.className = "ticket__mover";
    btnAtras.textContent = "◀";
    btnAtras.setAttribute("aria-label", "Mover a la columna anterior");
    btnAtras.disabled = (indice === 0); // No se puede retroceder desde "Nuevo"
    btnAtras.addEventListener("click", function () { moverTicket(ticket, -1); });

    var btnAdelante = document.createElement("button");
    btnAdelante.type = "button";
    btnAdelante.className = "ticket__mover";
    btnAdelante.textContent = "▶";
    btnAdelante.setAttribute("aria-label", "Mover a la columna siguiente");
    btnAdelante.disabled = (indice === ESTADOS.length - 1); // No avanza desde "Resuelto"
    btnAdelante.addEventListener("click", function () { moverTicket(ticket, 1); });

    acciones.appendChild(btnAtras);
    acciones.appendChild(btnAdelante);
    art.appendChild(acciones);

    return art;
}

// Mueve un ticket de estado (condicional + actualización del modelo)
function moverTicket(ticket, direccion) {
    var indice = ESTADOS.indexOf(ticket.estado);
    var nuevoIndice = indice + direccion;

    if (nuevoIndice >= 0 && nuevoIndice < ESTADOS.length) {
        ticket.estado = ESTADOS[nuevoIndice]; // Cambia el dato en el arreglo
        guardarTickets();                      // Persiste el cambio
        renderTablero();                       // Vuelve a dibujar el tablero
    }
}

// Pone la primera letra en mayúscula
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

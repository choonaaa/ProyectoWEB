# 🎫 HelpDesk IT — Sistema de Tickets de Soporte

Sitio web multipágina para **registrar, organizar y hacer seguimiento de tickets de soporte técnico**. Centraliza en un solo lugar las incidencias de IT de una organización (hardware, software, redes, accesos), evitando los pedidos perdidos entre correos, chats y llamadas.

> **Proyecto Integrador de Cursada** · Programación Web I
> Tecnicatura Universitaria en Programación de Sistemas · **UCES**

---

## 🌐 Demo

El sitio está publicado con **GitHub Pages**:

👉 **https://choonaaa.github.io/ProyectoWEB/**

---

## ✨ Funcionalidades

- **Página de inicio** con la propuesta de valor y el flujo del ticket (Reportar → Seguir → Resolver).
- **Tablero Kanban interactivo**: las tarjetas se generan dinámicamente desde un arreglo de objetos, con color según su prioridad, y se pueden **mover entre columnas** (Nuevo → En Progreso → Resuelto).
- **Filtros** por categoría y prioridad, y **buscador** de tickets en tiempo real.
- **Formulario accesible** de registro de incidencias con **validación visual en tiempo real** (campos en rojo/verde según sean válidos).
- **Menú hamburguesa** funcional en dispositivos móviles.
- **Diseño adaptable** (responsive) a escritorio, tablet y celular.

---

## 🛠️ Tecnologías y responsabilidades

El proyecto respeta la **separación de responsabilidades** del desarrollo del lado del cliente:

| Tecnología | Responsabilidad | Dónde |
|------------|-----------------|-------|
| **HTML5** | Estructura y semántica del contenido | `*.html` |
| **CSS3** | Diseño visual y adaptabilidad (Flexbox + Media Queries) | `recursos/style.css` |
| **JavaScript** | Lógica e interactividad (Vanilla JS, sin librerías) | `recursos/funciones.js` |

---

## 📁 Estructura del proyecto

```
.
├── index.html            # Página de inicio (presentación)
├── tablero.html          # Servicios + tablero Kanban interactivo
├── nuevo-ticket.html     # Formulario de registro de incidencias
├── recursos/
│   ├── style.css         # Hoja de estilos unificada
│   └── funciones.js      # Lógica de interactividad
├── imagenes/
│   └── hero-soporte.png  # Recursos multimedia
└── README.md
```

## 🧩 Fases del proyecto

El desarrollo se dividió en tres fases:

1. **Fase 1 — Planificación y HTML5:** análisis funcional, arquitectura cliente-servidor, wireframes y estructura semántica.
2. **Fase 2 — CSS y diseño adaptable:** modelo de caja, maquetación con **Flexbox** y responsive con **Media Queries** (breakpoints de 720px y 480px).
3. **Fase 3 — Interactividad (JS):** menú táctil, validación de formulario en tiempo real y el módulo Kanban (arrays, funciones, condicionales y bucles).

---

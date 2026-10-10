(function () {

  const LINKS = [
    ['index.html', 'Inicio'],
    ['catalogo.html', 'Catálogo'],
    ['nosotros.html', 'Nosotros'],
    ['entregas.html', 'Entregas']
  ];

  const WHATSAPP = '526146086392';
  const MENSAJE = 'Hola, me gustaría información sobre sus arreglos florales.';
  const URL_WA = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(MENSAJE);

  function normalizar(ruta) {
    const archivo = (ruta || '').split('/').pop() || 'index.html';
    return archivo.toLowerCase().replace('.html', '');
  }

  const paginaActual = normalizar(location.pathname);

  function listo(funcion) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', funcion);
    } else {
      funcion();
    }
  }

  function itemsMenu() {
    return LINKS.map(function (enlace) {
      const activo = normalizar(enlace[0]) === paginaActual;
      return `
        <li class="nav-item">
          <a
            class="nav-link${activo ? ' active' : ''}"
            href="${enlace[0]}"
            ${activo ? 'aria-current="page"' : ''}
          >
            ${enlace[1]}
          </a>
        </li>`;
    }).join('');
  }

  function itemsFooter() {
    return LINKS.map(function (enlace) {
      return `
        <li>
          <a href="${enlace[0]}">${enlace[1]}</a>
        </li>`;
    }).join('');
  }

  function iconoCarrito(clases) {
    return `
      <button
        type="button"
        class="carrito-link ${clases}"
        data-bs-toggle="offcanvas"
        data-bs-target="#carrito-panel"
        aria-controls="carrito-panel"
        aria-label="Ver carrito"
      >
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 7h12l-1 13H7L6 7z"/>
          <path d="M9 7a3 3 0 0 1 6 0"/>
        </svg>
        <span class="carrito-contador d-none">0</span>
      </button>`;
  }

  function crearNavbar() {
    return `
      <nav class="navbar navbar-expand-lg sticky-top site-nav">
        <div class="container">
          <a class="navbar-brand logo" href="index.html">
            Nöella’s <span>Floral</span>
          </a>
          ${iconoCarrito('d-inline-flex d-lg-none ms-auto me-2')}
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu"
            aria-controls="menu"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="menu">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              ${itemsMenu()}
            </ul>
            ${iconoCarrito('d-none d-lg-inline-flex me-3')}
            <a
              class="btn btn-wa"
              href="${URL_WA}"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </nav>`;
  }

  function crearFooter() {
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="row g-4">
            <div class="col-md-5">
              <h3 class="h4 mb-3">Nöella’s Floral</h3>
              <p>Florería boutique. Arreglos hechos a mano con amor para cada ocasión.</p>
            </div>
            <div class="col-6 col-md-3">
              <h4>Explora</h4>
              <ul class="list-unstyled mb-0">
                ${itemsFooter()}
              </ul>
            </div>
            <div class="col-6 col-md-4">
              <h4>Contacto</h4>
              <p class="mb-0">
                Nöella’s Floral
                <br>
                Chihuahua, Chihuahua
                <br>
                Instagram:
                <a href="https://instagram.com/noellas_floral" target="_blank" rel="noopener">
                  @noellas_floral
                </a>
                <br>
                WhatsApp: 614 608 6392
              </p>
            </div>
          </div>
          <div class="copy">
            © ${new Date().getFullYear()} Nöella’s Floral · Versión beta
          </div>
        </div>
      </footer>`;
  }

  function crearPanelCarrito() {
    return `
      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="carrito-panel"
        aria-labelledby="carrito-titulo"
      >
        <div class="offcanvas-header">
          <h2 class="offcanvas-title h4" id="carrito-titulo">Tu carrito</h2>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <div class="offcanvas-body" id="carrito-vista"></div>
      </div>`;
  }

  function crearBotonFlotante() {
    const boton = document.createElement('a');

    boton.href = URL_WA;
    boton.target = '_blank';
    boton.rel = 'noopener';
    boton.className = 'wa-float';
    boton.setAttribute('aria-label', 'Escríbenos por WhatsApp');
    boton.innerHTML = `
      <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/>
      </svg>`;

    document.body.appendChild(boton);
  }

  listo(function () {

    let contenedorNav = document.getElementById('site-navbar');
    let contenedorFooter = document.getElementById('site-footer');

    if (!contenedorNav) {
      contenedorNav = document.createElement('div');
      contenedorNav.id = 'site-navbar';
      document.body.insertBefore(contenedorNav, document.body.firstChild);
    }

    if (!contenedorFooter) {
      contenedorFooter = document.createElement('div');
      contenedorFooter.id = 'site-footer';
      document.body.appendChild(contenedorFooter);
    }

    contenedorNav.innerHTML = crearNavbar();
    contenedorFooter.innerHTML = crearFooter();

    document.body.insertAdjacentHTML('beforeend', crearPanelCarrito());

    crearBotonFlotante();

  });

})();
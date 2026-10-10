(function () {

  const CLAVE = 'noellas_cookies';
  const GA_ID = 'G-XXXXXXXXXX';

  function listo(funcion) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', funcion);
    } else {
      funcion();
    }
  }

  function leerPreferencia() {
    try {
      return localStorage.getItem(CLAVE);
    } catch (error) {
      return null;
    }
  }

  function guardarPreferencia(valor) {
    try {
      localStorage.setItem(CLAVE, valor);
    } catch (error) {
      // almacenamiento no disponible
    }
  }

  function cargarAnalytics() {
    if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') {
      return;
    }

    if (document.getElementById('ga-script')) {
      return;
    }

    const script = document.createElement('script');

    script.id = 'ga-script';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    function gtag() {
      window.dataLayer.push(arguments);
    }

    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true
    });
  }

  function inyectarEstilos() {
    if (document.getElementById('cookies-estilos')) {
      return;
    }

    const estilo = document.createElement('style');

    estilo.id = 'cookies-estilos';
    estilo.textContent = `
      .cookies-banner {
        position: fixed;
        left: 1rem;
        bottom: 1rem;
        z-index: 1040;
        max-width: 26rem;
        background-color: #FFF9F4;
        border: 1px solid #C9A66B;
        border-radius: 1rem;
        padding: 1rem 1.2rem;
        box-shadow: 0 10px 30px rgba(138, 117, 107, .25);
        color: #8A756B;
      }
      .cookies-texto {
        margin-bottom: .8rem;
        font-size: .82rem;
        line-height: 1.5;
      }
      .cookies-acciones {
        display: flex;
        gap: .5rem;
      }
      .cookies-acciones .btn {
        padding: .35rem 1.2rem;
        font-size: .82rem;
      }
      @media (max-width: 575.98px) {
        .cookies-banner {
          left: .8rem;
          right: .8rem;
          bottom: 5.6rem;
          max-width: none;
        }
      }`;

    document.head.appendChild(estilo);
  }

  function crearBanner() {
    inyectarEstilos();

    const banner = document.createElement('div');

    banner.className = 'cookies-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies');

    banner.innerHTML = `
      <p class="cookies-texto">
        Usamos almacenamiento local y cookies de analítica para mejorar tu experiencia y recordar tu carrito.
        Consulta nuestro
        <a href="privacidad.html">aviso de privacidad</a>.
      </p>
      <div class="cookies-acciones">
        <button type="button" class="btn btn-rosa btn-sm" data-cookies="aceptado">
          Aceptar
        </button>
        <button type="button" class="btn btn-linea btn-sm" data-cookies="rechazado">
          Rechazar
        </button>
      </div>`;

    banner.addEventListener('click', function (evento) {
      const boton = evento.target.closest('[data-cookies]');

      if (!boton) {
        return;
      }

      const valor = boton.dataset.cookies;

      guardarPreferencia(valor);

      if (valor === 'aceptado') {
        cargarAnalytics();
      }

      banner.remove();
    });

    document.body.appendChild(banner);
  }

  listo(function () {
    const preferencia = leerPreferencia();

    if (preferencia === 'aceptado') {
      cargarAnalytics();
      return;
    }

    if (preferencia === 'rechazado') {
      return;
    }

    crearBanner();
  });

})();

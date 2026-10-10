(function () {

  const vista = document.getElementById('carrito-vista');

  if (!vista) {
    return;
  }

  const esc = Noellas.esc;

  function detalleItem(item) {
    const lineas = [
      '<li><strong>Tamaño:</strong> ' + esc(item.tamano) + '</li>',
      item.color ? '<li><strong>Color:</strong> ' + esc(item.color) + '</li>' : '',
      item.coreana ? '<li><strong>Envoltura coreana:</strong> Sí (+$150 MXN)</li>' : '',
      '<li><strong>Fecha:</strong> ' + esc(Noellas.fechas.formato(item.fecha)) + '</li>',
      '<li><strong>Horario:</strong> ' + esc(item.horario) + '</li>',
      item.notas ? '<li><strong>Notas:</strong> ' + esc(item.notas) + '</li>' : ''
    ];

    return lineas.join('');
  }

  function itemHTML(item) {
    return `
      <article class="carrito-item" data-uid="${esc(item.uid)}">
        <img
          src="assets/img/${esc(item.img)}"
          alt="${esc(item.nombre)}"
        >
        <div class="carrito-info">
          <h3>${esc(item.nombre)}</h3>
          <ul class="carrito-detalle">
            ${detalleItem(item)}
          </ul>
        </div>
        <div class="carrito-controles">
          <div class="cantidad">
            <button type="button" data-accion="menos" aria-label="Quitar una pieza">−</button>
            <span>${item.cantidad}</span>
            <button type="button" data-accion="mas" aria-label="Agregar una pieza">+</button>
          </div>
          <button type="button" class="btn btn-sm btn-linea" data-accion="quitar">
            Quitar
          </button>
        </div>
      </article>`;
  }

  function vacioHTML() {
    return `
      <div class="carrito-vacio">
        <h2 class="h3">Tu carrito está vacío</h2>
        <p>Explora el catálogo y agrega tus arreglos favoritos.</p>
        <a href="catalogo.html" class="btn btn-rosa">Ver catálogo</a>
      </div>`;
  }

  function resumenHTML(items) {
    return `
      <div class="carrito-resumen mt-4">
        <p class="mb-1">
          <strong>Piezas en tu pedido:</strong>
          ${Noellas.carrito.total(items)}
        </p>
        <p class="small">
          El costo final y el envío ($85 a $150 MXN según tu zona) se confirman por WhatsApp.
        </p>
        <div class="error-envio form-error mb-3" role="alert" hidden></div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-rosa btn-lg" data-accion="enviar">
            Enviar pedido completo por WhatsApp
          </button>
          <a href="catalogo.html" class="btn btn-linea btn-lg">Seguir comprando</a>
          <button type="button" class="btn btn-linea btn-lg" data-accion="vaciar">
            Vaciar carrito
          </button>
        </div>
      </div>`;
  }

  function render() {
    const items = Noellas.carrito.obtener();

    if (!items.length) {
      vista.innerHTML = vacioHTML();
      return;
    }

    vista.innerHTML = items.map(itemHTML).join('') + resumenHTML(items);
  }

  function enviar() {
    const items = Noellas.carrito.obtener();
    const caja = vista.querySelector('.error-envio');
    const problemas = [];

    items.forEach(function (item) {
      const error = Noellas.fechas.validar(item.fecha);
      const tarjeta = vista.querySelector('[data-uid="' + item.uid + '"]');

      if (tarjeta) {
        tarjeta.classList.toggle('item-invalido', Boolean(error));
      }

      if (error) {
        problemas.push(item.nombre + ': ' + error);
      }
    });

    if (problemas.length) {
      caja.innerHTML = problemas.map(esc).join('<br>') + '<br>Quita el producto y vuelve a agregarlo con una fecha válida.';
      caja.hidden = false;
      return;
    }

    Noellas.abrirWhatsApp(Noellas.mensaje.carrito(items));
  }

  vista.addEventListener('click', function (evento) {
    const boton = evento.target.closest('[data-accion]');

    if (!boton) {
      return;
    }

    const tarjeta = boton.closest('.carrito-item');
    const uid = tarjeta ? tarjeta.dataset.uid : '';
    const accion = boton.dataset.accion;

    if (accion === 'mas') {
      Noellas.carrito.cambiarCantidad(uid, 1);
    }

    if (accion === 'menos') {
      Noellas.carrito.cambiarCantidad(uid, -1);
    }

    if (accion === 'quitar') {
      Noellas.carrito.quitar(uid);
    }

    if (accion === 'vaciar') {
      Noellas.carrito.vaciar();
    }

    if (accion === 'enviar') {
      enviar();
    }
  });

  document.addEventListener('carrito:cambio', render);
  window.addEventListener('storage', render);

  render();

})();
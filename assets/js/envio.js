(function () {

  const CLAVE_ENVIO = 'noellas_envio_pendiente';

  const CAMPOS_ENVIO = [
    {
      k: 'nombre',
      etiqueta: 'Nombre de quien recibe',
      corto: 'el nombre de quien recibe',
      req: true,
      base: true,
      auto: 'name'
    },
    {
      k: 'telefono',
      etiqueta: 'Teléfono de quien recibe (10 dígitos)',
      corto: 'el teléfono de quien recibe',
      req: true,
      base: true,
      tipo: 'tel',
      auto: 'tel'
    },
    {
      k: 'direccion',
      etiqueta: 'Dirección (colonia o fraccionamiento)',
      corto: 'la dirección (colonia o fraccionamiento)',
      req: true,
      base: true
    },
    {
      k: 'calle',
      etiqueta: 'Calle',
      corto: 'la calle',
      req: true,
      base: true
    },
    {
      k: 'numero',
      etiqueta: 'No. (exterior / interior)',
      corto: 'el número',
      req: true,
      base: true
    },
    {
      k: 'entre',
      etiqueta: 'Entre calles (opcional)',
      req: false,
      base: true
    },
    {
      k: 'indicaciones',
      etiqueta: 'Indicaciones extras (opcional)',
      req: false,
      base: false,
      area: true
    },
    {
      k: 'dedicatoria',
      etiqueta: 'Dedicatoria (opcional)',
      req: false,
      base: false,
      area: true
    }
  ];

  const N = window.Noellas;
  const contenedor = document.getElementById('envio-contenido');

  function leerPendiente() {
    try {
      const datos = JSON.parse(sessionStorage.getItem(CLAVE_ENVIO));

      if (datos && Array.isArray(datos.items) && datos.items.length) {
        return datos;
      }
    } catch (error) {
      // sin datos
    }

    return null;
  }

  function vacioHTML() {
    return `
      <div class="envio-vacio">
        <p>No hay un pedido pendiente.</p>
        <a href="catalogo.html" class="btn btn-rosa">Ir al catálogo</a>
      </div>`;
  }

  function campoHTML(campo, indice) {
    const id = 'envio-' + indice + '-' + campo.k;
    const comun = ' class="form-control" id="' + id + '" data-k="' + campo.k + '"' +
      (campo.auto ? ' autocomplete="' + campo.auto + '"' : '');
    const entrada = campo.area
      ? '<textarea' + comun + ' rows="2" maxlength="300"></textarea>'
      : '<input type="' + (campo.tipo || 'text') + '"' + comun + ' maxlength="120">';

    return '<label class="form-label" for="' + id + '">' +
      N.esc(campo.etiqueta) +
      '</label>' +
      entrada;
  }

  function bloqueHTML(item, indice, varios) {
    const base = CAMPOS_ENVIO.filter(function (c) {
      return c.base;
    });
    const extra = CAMPOS_ENVIO.filter(function (c) {
      return !c.base;
    });
    const misma = varios && indice > 0;

    return `
      <section class="envio-bloque" data-bloque="${indice}">
        <h2>${varios ? 'Pedido ' + (indice + 1) + ': ' : ''}${N.esc(item.nombre)}</h2>
        <p class="envio-resumen">
          ${N.esc(item.tamano)} · ${N.esc(N.formatoFecha(item.fecha))} · ${N.esc(item.horario)}
        </p>
        ${misma ? `
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="envio-${indice}-misma" data-misma checked>
            <label class="form-check-label small" for="envio-${indice}-misma">
              Misma entrega que el pedido 1 (mismo receptor y dirección)
            </label>
          </div>` : ''}
        <div class="envio-base" ${misma ? 'hidden' : ''}>
          ${base.map(function (c) { return campoHTML(c, indice); }).join('')}
        </div>
        ${extra.map(function (c) { return campoHTML(c, indice); }).join('')}
      </section>`;
  }

  function iniciar() {
    const pendiente = leerPendiente();

    if (!pendiente) {
      contenedor.innerHTML = vacioHTML();
      return;
    }

    const items = pendiente.items;
    const varios = items.length > 1;

    contenedor.innerHTML = `
      <form novalidate>
        ${items.map(function (item, indice) { return bloqueHTML(item, indice, varios); }).join('')}
        <div class="envio-error" role="alert" hidden></div>
        <div class="envio-acciones">
          <button type="submit" class="btn btn-rosa">Enviar pedido por WhatsApp</button>
          <a href="catalogo.html" class="btn btn-linea">Volver</a>
        </div>
      </form>`;

    const form = contenedor.querySelector('form');
    const cajaError = contenedor.querySelector('.envio-error');

    form.addEventListener('change', function (evento) {
      const casilla = evento.target.closest('[data-misma]');

      if (casilla) {
        casilla.closest('.envio-bloque').querySelector('.envio-base').hidden = casilla.checked;
      }
    });

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const errores = [];
      const datos = [];

      items.forEach(function (item, indice) {
        const bloque = form.querySelector('[data-bloque="' + indice + '"]');
        const casilla = bloque.querySelector('[data-misma]');
        const misma = Boolean(casilla && casilla.checked);
        const prefijo = varios ? 'Pedido ' + (indice + 1) + ': ' : '';
        const dato = {};

        CAMPOS_ENVIO.forEach(function (c) {
          if (misma && c.base) {
            dato[c.k] = datos[0][c.k];
            return;
          }

          const valor = bloque.querySelector('[data-k="' + c.k + '"]').value.trim();

          dato[c.k] = valor;

          if (c.req && !valor) {
            errores.push(prefijo + 'falta ' + c.corto + '.');
          }
        });

        if (!misma && dato.telefono && dato.telefono.replace(/\D/g, '').length !== 10) {
          errores.push(prefijo + 'el teléfono debe tener 10 dígitos.');
        }

        datos.push(dato);
      });

      if (errores.length) {
        cajaError.innerHTML = errores.map(N.esc).join('<br>');
        cajaError.hidden = false;
        cajaError.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }

      items.forEach(function (item, indice) {
        item.envio = datos[indice];
      });

      const mensaje = pendiente.modo === 'carrito'
        ? N.mensajeCarrito(items)
        : N.mensajeIndividual(items[0]);

      N.abrirWhatsApp(mensaje);
    });
  }

  document.addEventListener('DOMContentLoaded', iniciar);

})();
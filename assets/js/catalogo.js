(function () {

  const contenedor = document.getElementById('catalogo-lista');

  if (!contenedor) {
    return;
  }

  const esc = Noellas.esc;

  const COLORES_ROSAS = [
    'Rojas',
    'Blancas',
    'Rosas',
    'Amarillas',
    'Otro (indícalo en notas)'
  ];

  const NOTA_MIXTO = 'Cada arreglo mixto es diferente y único, ya que varía acorde a la disponibilidad de flores y tonalidades del día.';

  const CATEGORIAS = [
    { id: 'mixtos', titulo: 'Ramos mixtos y de temporada' },
    { id: 'rosas', titulo: 'Rosas' },
    { id: 'girasoles', titulo: 'Girasoles' },
    { id: 'jarrones', titulo: 'Jarrones, bases y canastas' },
    { id: 'cafe', titulo: 'Coffee & Flowers' },
    { id: 'funebres', titulo: 'Arreglos fúnebres' }
  ];

  const PRODUCTOS = [

    {
      id: 'bouquets-mixtos',
      categoria: 'mixtos',
      nombre: 'Nöella’s Bouquets Mixtos',
      img: 'ramomixto1.jpeg',
      descripcion: 'Mix con flores de temporada. Personalización con al menos 2 días de anticipación.',
      tamanos: [
        'Chico (18 flores, rosas y follaje, circular)',
        'Mediano (27 flores, rosas y follaje, circular)',
        'Grande (50 flores, rosas y follaje, circular)',
        'XL (100 flores, rosas y follaje, redonda)'
      ],
      colores: null,
      coreana: true,
      nota: NOTA_MIXTO
    },
    {
      id: 'white-bouquet',
      categoria: 'mixtos',
      nombre: 'White Bouquet',
      img: 'blanco.jpeg',
      descripcion: 'Ramo de flores combinadas en tonos blancos.',
      tamanos: [
        'Mediano (28 flores)',
        'Grande (50 flores)'
      ],
      colores: null,
      coreana: true,
      nota: ''
    },
    {
      id: 'ramo-hortensia',
      categoria: 'mixtos',
      nombre: 'Ramo de Hortensia',
      img: 'rh.jpeg',
      descripcion: 'Ramo de 1 hortensia acompañado de mini rosa y follaje.',
      tamanos: [
        'Único'
      ],
      colores: null,
      coreana: true,
      nota: 'Color sujeto a disponibilidad. Solicitar con 1 día de anticipación.'
    },
    {
      id: 'gerberas',
      categoria: 'mixtos',
      nombre: 'Gerberas',
      img: 'ger.jpeg',
      descripcion: 'Gerberas en color a preferencia con follaje.',
      tamanos: [
        'Chico (10 gerberas)',
        'Mediano (20 gerberas)'
      ],
      colores: null,
      coreana: true,
      nota: 'Indica el color de tu preferencia en las notas.'
    },
    {
      id: 'lirios',
      categoria: 'mixtos',
      nombre: 'Lirios',
      img: 'lirio.jpeg',
      descripcion: 'Lirios (color a elección) acompañados con follaje.',
      tamanos: [
        'Chico (10 lirios)'
      ],
      colores: null,
      coreana: true,
      nota: 'Indica el color de tu preferencia en las notas.'
    },
    {
      id: 'tulipanes',
      categoria: 'mixtos',
      nombre: 'Tulipanes',
      img: 't1.jpeg',
      descripcion: 'Tulipanes con follaje.',
      tamanos: [
        'Chico (10 tulipanes)',
        'Mediano (20 tulipanes)'
      ],
      colores: null,
      coreana: true,
      nota: ''
    },

    {
      id: 'rosas-clasicos',
      categoria: 'rosas',
      nombre: 'Ramos de Rosas Clásicos',
      img: 'fr1.jpeg',
      descripcion: 'Elegibles en tu color favorito. Se pueden elegir 2 colores a partir del tamaño Grande.',
      tamanos: [
        'Chico (12 rosas)',
        'Mediano (24 rosas)',
        'Grande (50 rosas)',
        'XL (100 rosas)'
      ],
      colores: COLORES_ROSAS,
      coreana: true,
      nota: 'Si eliges 2 colores (desde Grande), indícalo en las notas.'
    },
    {
      id: 'rosas-inglesas',
      categoria: 'rosas',
      nombre: 'Rosas Inglesas',
      img: 'ri.jpeg',
      descripcion: 'Paquete de 10 tallos (cada tallo con 1 a 3 botones) más follaje.',
      tamanos: [
        'Único (10 tallos)'
      ],
      colores: null,
      coreana: true,
      nota: 'Se pueden agregar flores extra. Pedidos con al menos 1 semana de anticipación.'
    },
    {
      id: 'arreglo-tess',
      categoria: 'rosas',
      nombre: 'Arreglo Tess',
      img: 'fr2.jpeg',
      descripcion: 'Rosas con mini gerberas. El tono de la mini gerbera puede variar según disponibilidad.',
      tamanos: [
        'Chico (12 rosas en cascada)',
        'Mediano (24 rosas en cascada)',
        'Grande (50 rosas redondas)'
      ],
      colores: COLORES_ROSAS,
      coreana: false,
      nota: 'Solicitar con 1 día de anticipación.'
    },
    {
      id: 'bolsita-noellas',
      categoria: 'rosas',
      nombre: 'Bolsita Nöella’s',
      img: 'fr3.jpeg',
      descripcion: 'Acompañada de rosas, gerberas, mini rosa, margarita y follaje.',
      tamanos: [
        'Único (12x15 cm aprox.)'
      ],
      colores: null,
      coreana: false,
      nota: ''
    },
    {
      id: 'rosas-gerberas',
      categoria: 'rosas',
      nombre: 'Rosas y Gerberas',
      img: 'fr4.jpeg',
      descripcion: 'Rosas, gerberas y follaje combinados.',
      tamanos: [
        'Mediano (24 rosas y gerberas)',
        'Grande (50 rosas y gerberas)'
      ],
      colores: null,
      coreana: true,
      nota: ''
    },
    {
      id: 'rosas-lisianthus',
      categoria: 'rosas',
      nombre: 'Rosas y Lisianthus',
      img: 'rl.jpeg',
      descripcion: 'Rosas, lisianthus y follaje (color a elección).',
      tamanos: [
        'Mediano (24 rosas y lisianthus)',
        'Grande (50 rosas y lisianthus)'
      ],
      colores: COLORES_ROSAS,
      coreana: true,
      nota: 'Solicitar con 1 día de anticipación.'
    },

    {
      id: 'girasoles-ramo',
      categoria: 'girasoles',
      nombre: 'Girasoles (Ramo)',
      img: 'rg1.jpeg',
      descripcion: 'Girasoles con follaje.',
      tamanos: [
        'Chico (10 girasoles)'
      ],
      colores: null,
      coreana: true,
      nota: ''
    },
    {
      id: 'jarron-girasoles',
      categoria: 'girasoles',
      nombre: 'Jarrón de Girasoles',
      img: 'jg.jpeg',
      descripcion: '10 girasoles en base de cristal acompañados de follaje.',
      tamanos: [
        'Único (10 girasoles)'
      ],
      colores: null,
      coreana: false,
      nota: ''
    },

    {
      id: 'jarron-mixto',
      categoria: 'jarrones',
      nombre: 'Jarrón Mixto',
      img: 'jm.jpeg',
      descripcion: 'Mix con flores de temporada en base de jarrón. Personalización con al menos 2 días de anticipación.',
      tamanos: [
        'Chico (16 flores)',
        'Mediano (27 flores)',
        'Grande (50 flores)'
      ],
      colores: null,
      coreana: false,
      nota: NOTA_MIXTO
    },
    {
      id: 'jarron-cherry',
      categoria: 'jarrones',
      nombre: 'Jarrón Cherry',
      img: 'jc.jpeg',
      descripcion: 'Jarrón con rosas rojas acompañadas de mini rosa blanca y astromelia.',
      tamanos: [
        'Chico (12 rosas)',
        'Mediano (24 rosas)',
        'Grande (50 rosas)'
      ],
      colores: null,
      coreana: false,
      nota: ''
    },
    {
      id: 'hortensia-base',
      categoria: 'jarrones',
      nombre: 'Hortensia en Base',
      img: 'bh.jpeg',
      descripcion: 'Base de cerámica con hortensia, lisianthus y flores mixtas.',
      tamanos: [
        'Único'
      ],
      colores: null,
      coreana: false,
      nota: 'Color sujeto a disponibilidad. Solicitar con 1 día de anticipación. ' + NOTA_MIXTO
    },
    {
      id: 'ceramica-mixta',
      categoria: 'jarrones',
      nombre: 'Cerámica Mixta',
      img: 'bc3.jpeg',
      descripcion: 'Base de cerámica con flores del día, rosas, mini rosas, gerberas, clavelina y follaje.',
      tamanos: [
        'Único'
      ],
      colores: null,
      coreana: false,
      nota: 'Elección libre de tonalidades (indícalas en las notas). Solicitar con 1 día de anticipación. ' + NOTA_MIXTO
    },
    {
      id: 'cajita-mixta',
      categoria: 'jarrones',
      nombre: 'Cajita Mixta',
      img: 'bc2.jpeg',
      descripcion: 'Caja de flores mixtas (vista frontal).',
      tamanos: [
        'Chica (20x14 cm aprox.)',
        'Mediana (35x14 cm aprox.)'
      ],
      colores: null,
      coreana: false,
      nota: 'Solicitar con 1 día de anticipación. ' + NOTA_MIXTO
    },
    {
      id: 'canasta-noe-mar',
      categoria: 'jarrones',
      nombre: 'Canasta Noe Mar',
      img: 'bc1.jpeg',
      descripcion: 'Mix de flores del día.',
      tamanos: [
        'Chica (12x12 cm)',
        'Mediana (25x20 cm)'
      ],
      colores: null,
      coreana: false,
      nota: NOTA_MIXTO
    },

    {
      id: 'coffee-flowers',
      categoria: 'cafe',
      nombre: 'Coffee & Flowers',
      img: 'cafe.jpeg',
      descripcion: 'Incluye tu café favorito y un delicado arreglo floral en presentación especial.',
      tamanos: [
        'Único'
      ],
      colores: null,
      coreana: false,
      nota: 'Indica tu café favorito en las notas. Solicitar con 1 día de anticipación.'
    },

    {
      id: 'coronas',
      categoria: 'funebres',
      nombre: 'Coronas',
      img: 'corona1.jpeg',
      descripcion: 'Coronas fúnebres elaboradas con flores frescas.',
      tamanos: [
        'Chica',
        'Mediana',
        'Grande'
      ],
      colores: null,
      coreana: false,
      nota: 'Se solicitan con al menos 3 horas de anticipación.'
    }

  ];

  /* ---------- Render ---------- */

  function opciones(lista, textoInicial) {
    const unica = lista.length === 1;
    const inicial = unica ? '' : '<option value="">' + textoInicial + '</option>';

    return inicial + lista.map(function (valor) {
      return '<option value="' + esc(valor) + '"' + (unica ? ' selected' : '') + '>' + esc(valor) + '</option>';
    }).join('');
  }

  function bloqueColor(producto, id) {
    if (!producto.colores) {
      return '';
    }

    return `
      <label class="form-label" for="${id}-color">Color</label>
      <select class="form-select" id="${id}-color" data-campo="color">
        ${opciones(producto.colores, 'Elige un color')}
      </select>`;
  }

  function bloqueCoreana(producto, id) {
    if (!producto.coreana) {
      return '';
    }

    return `
      <div class="form-check mt-3">
        <input
          class="form-check-input"
          type="checkbox"
          id="${id}-coreana"
          data-campo="coreana"
        >
        <label class="form-check-label small" for="${id}-coreana">
          Envoltura coreana (+$150 MXN)
        </label>
      </div>`;
  }

  function tarjetaHTML(producto) {
    const id = 'p-' + producto.id;

    return `
      <div class="col-sm-6 col-lg-4">
        <article class="tarjeta" data-producto="${producto.id}">
          <img
            src="assets/img/${producto.img}"
            alt="${esc(producto.nombre)}"
            loading="lazy"
          >
          <div class="tarjeta-cuerpo">
            <h3>${esc(producto.nombre)}</h3>
            <p>${esc(producto.descripcion)}</p>
            ${producto.nota ? '<p class="nota-tarjeta">' + esc(producto.nota) + '</p>' : ''}
            <div class="pedido">
              <label class="form-label" for="${id}-tamano">Tamaño</label>
              <select class="form-select" id="${id}-tamano" data-campo="tamano">
                ${opciones(producto.tamanos, 'Elige un tamaño')}
              </select>
              ${bloqueColor(producto, id)}
              ${bloqueCoreana(producto, id)}
              <label class="form-label" for="${id}-fecha">Fecha de entrega</label>
              <input
                class="form-control"
                type="date"
                id="${id}-fecha"
                data-campo="fecha"
                min="${Noellas.fechas.hoyISO()}"
              >
              <label class="form-label" for="${id}-horario">Horario</label>
              <select class="form-select" id="${id}-horario" data-campo="horario">
                ${opciones(Noellas.HORARIOS, 'Elige un horario')}
              </select>
              <label class="form-label" for="${id}-notas">Notas de personalización (opcional)</label>
              <textarea
                class="form-control"
                id="${id}-notas"
                data-campo="notas"
                rows="2"
                maxlength="300"
              ></textarea>
              <div class="form-error" role="alert" hidden></div>
              <div class="form-ok" role="status" hidden></div>
              <div class="acciones">
                <button type="button" class="btn btn-rosa" data-accion="whatsapp">
                  Pedir por WhatsApp
                </button>
                <button type="button" class="btn btn-linea" data-accion="carrito">
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>`;
  }

  function categoriaHTML(categoria) {
    const productos = PRODUCTOS.filter(function (producto) {
      return producto.categoria === categoria.id;
    });

    return `
      <section class="categoria" id="${categoria.id}">
        <h2>${esc(categoria.titulo)}</h2>
        <div class="row g-4">
          ${productos.map(tarjetaHTML).join('')}
        </div>
      </section>`;
  }

  contenedor.innerHTML = CATEGORIAS.map(categoriaHTML).join('');

  if (location.hash) {
    const destino = document.querySelector(location.hash);

    if (destino) {
      destino.scrollIntoView();
    }
  }

  /* ---------- Lógica de tarjeta ---------- */

  function campo(tarjeta, nombre) {
    return tarjeta.querySelector('[data-campo="' + nombre + '"]');
  }

  function mostrarError(tarjeta, mensajes) {
    const caja = tarjeta.querySelector('.form-error');

    caja.innerHTML = mensajes.map(esc).join('<br>');
    caja.hidden = mensajes.length === 0;
  }

  function mostrarOk(tarjeta) {
    const caja = tarjeta.querySelector('.form-ok');

    caja.innerHTML = 'Agregado al carrito ✓ <a href="carrito.html">Ver carrito</a>';
    caja.hidden = false;

    setTimeout(function () {
      caja.hidden = true;
    }, 4000);
  }

  function leerTarjeta(tarjeta) {
    const producto = PRODUCTOS.find(function (p) {
      return p.id === tarjeta.dataset.producto;
    });

    const tamano = campo(tarjeta, 'tamano').value;
    const color = campo(tarjeta, 'color') ? campo(tarjeta, 'color').value : '';
    const coreana = campo(tarjeta, 'coreana') ? campo(tarjeta, 'coreana').checked : false;
    const fecha = campo(tarjeta, 'fecha').value;
    const horario = campo(tarjeta, 'horario').value;
    const notas = campo(tarjeta, 'notas').value.trim();

    const errores = [];

    if (!tamano) {
      errores.push('Elige un tamaño.');
    }

    if (producto.colores && !color) {
      errores.push('Elige un color.');
    }

    const errorFecha = Noellas.fechas.validar(fecha);

    if (errorFecha) {
      errores.push(errorFecha);
    }

    if (!horario) {
      errores.push('Elige un horario de entrega.');
    }

    mostrarError(tarjeta, errores);

    if (errores.length) {
      return null;
    }

    return {
      id: producto.id,
      nombre: producto.nombre,
      img: producto.img,
      tamano: tamano,
      color: color,
      coreana: coreana,
      fecha: fecha,
      horario: horario,
      notas: notas
    };
  }

  contenedor.addEventListener('click', function (evento) {
    const boton = evento.target.closest('[data-accion]');

    if (!boton) {
      return;
    }

    const tarjeta = boton.closest('.tarjeta');
    const item = leerTarjeta(tarjeta);

    if (!item) {
      return;
    }

    if (boton.dataset.accion === 'whatsapp') {
      item.cantidad = 1;
      Noellas.abrirWhatsApp(Noellas.mensaje.individual(item));
      return;
    }

    Noellas.carrito.agregar(item);
    mostrarOk(tarjeta);
  });

  contenedor.addEventListener('change', function (evento) {
    const entrada = evento.target;

    if (!entrada.matches('[data-campo="fecha"]')) {
      return;
    }

    const tarjeta = entrada.closest('.tarjeta');
    const error = Noellas.fechas.validar(entrada.value);

    if (error && entrada.value) {
      entrada.value = '';
      mostrarError(tarjeta, [error]);
      return;
    }

    mostrarError(tarjeta, []);
  });

})();
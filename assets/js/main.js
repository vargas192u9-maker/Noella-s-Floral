(function () {

  const WHATSAPP = '526146086392';
  const CLAVE = 'noellas_carrito';
  const FLATPICKR = 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/';

  const HORARIOS = [
    '🌸 Ruta matutina: 10:00 AM – 12:00 PM',
    '🌷 Ruta vespertina: 2:00 PM – 6:00 PM'
  ];

  const COLORES_ROSAS = [
    'Rojas',
    'Blancas',
    'Rosas',
    'Amarillas',
    'Otro (indícalo en notas)'
  ];

  const NOTA_MIXTO = 'Cada arreglo mixto es diferente y único, ya que varía acorde a la disponibilidad de flores y tonalidades del día.';

  /* =====================================================
     UTILIDADES
  ===================================================== */

  function listo(funcion) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', funcion);
    } else {
      funcion();
    }
  }

  function esc(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function abrirWhatsApp(mensaje) {
    const url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensaje);
    window.open(url, '_blank', 'noopener');
  }

  /* =====================================================
     FECHAS
  ===================================================== */

  function fechaLocal(texto) {
    const partes = texto.split('-').map(Number);
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }

  function aISO(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return fecha.getFullYear() + '-' + mes + '-' + dia;
  }

  function hoyISO() {
    return aISO(new Date());
  }

  function formatoFecha(texto) {
    return fechaLocal(texto).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function validarFecha(texto) {
    if (!texto) {
      return 'Elige una fecha de entrega.';
    }

    const fecha = fechaLocal(texto);
    const hoy = fechaLocal(hoyISO());

    if (isNaN(fecha.getTime())) {
      return 'La fecha no es válida.';
    }

    if (fecha < hoy) {
      return 'Esa fecha ya pasó. Elige otra.';
    }

    if (fecha.getDay() === 0) {
      return 'Los domingos no hay entregas. Elige otro día.';
    }

    return '';
  }

  /* =====================================================
     CARRITO (ALMACÉN)
  ===================================================== */

  function leer() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE));
      return Array.isArray(datos) ? datos : [];
    } catch (error) {
      return [];
    }
  }

  function total(items) {
    return (items || leer()).reduce(function (suma, item) {
      return suma + item.cantidad;
    }, 0);
  }

  function actualizarContador() {
    const cantidad = total();

    document.querySelectorAll('.carrito-contador').forEach(function (etiqueta) {
      etiqueta.textContent = cantidad;
      etiqueta.classList.toggle('d-none', cantidad === 0);
    });
  }

  function guardar(items) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch (error) {
      // almacenamiento no disponible
    }

    actualizarContador();
    document.dispatchEvent(new CustomEvent('carrito:cambio'));
  }

  function agregar(nuevo) {
    const items = leer();

    const clave = [
      nuevo.id,
      nuevo.tamano,
      nuevo.color,
      nuevo.coreana,
      nuevo.fecha,
      nuevo.horario,
      nuevo.notas
    ].join('|');

    const existente = items.find(function (item) {
      return item.clave === clave;
    });

    if (existente) {
      existente.cantidad += 1;
    } else {
      nuevo.clave = clave;
      nuevo.uid = Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      nuevo.cantidad = 1;
      items.push(nuevo);
    }

    guardar(items);
  }

  function cambiarCantidad(uid, cambio) {
    const items = leer();

    items.forEach(function (item) {
      if (item.uid === uid) {
        item.cantidad += cambio;
      }
    });

    guardar(items.filter(function (item) {
      return item.cantidad > 0;
    }));
  }

  function quitar(uid) {
    guardar(leer().filter(function (item) {
      return item.uid !== uid;
    }));
  }

  function vaciar() {
    guardar([]);
  }

  /* =====================================================
     MENSAJES DE WHATSAPP
  ===================================================== */

  function lineasItem(item) {
    return [
      '🌸 *' + item.nombre + '*',
      '• Tamaño: ' + item.tamano,
      item.color ? '• Color: ' + item.color : '',
      item.coreana ? '• Envoltura coreana: Sí (+$150 MXN)' : '',
      item.cantidad > 1 ? '• Cantidad: ' + item.cantidad : '',
      lineaPrecio(item),
      '• Fecha: ' + formatoFecha(item.fecha),
      '• Horario: ' + item.horario,
      item.notas ? '• Notas: ' + item.notas : ''
    ].filter(Boolean).concat(lineasEnvio(item));
  }

  function lineasEnvio(item) {
    const e = item.envio;

    if (!e) {
      return [];
    }

    return [
      '📍 *Datos de envío*',
      '• Recibe: ' + e.nombre,
      '• Teléfono: ' + e.telefono,
      '• Dirección: ' + e.direccion,
      '• Calle: ' + e.calle + ', No. ' + e.numero,
      e.entre ? '• Entre calles: ' + e.entre : '',
      e.indicaciones ? '• Indicaciones extras: ' + e.indicaciones : '',
      e.dedicatoria ? '• Dedicatoria: ' + e.dedicatoria : ''
    ].filter(Boolean);
  }

  function mensajeIndividual(item) {
    return [
      'Hola, me gustaría hacer el siguiente pedido:',
      '',
      lineasItem(item).join('\n'),
      '',
      '¿Me confirmas disponibilidad y costo? ¡Gracias!'
    ].join('\n');
  }

  function mensajeCarrito(items) {
    const bloques = items.map(function (item, indice) {
      return '*Pedido ' + (indice + 1) + '*\n' + lineasItem(item).join('\n');
    });

    return [
      'Hola, me gustaría hacer el siguiente pedido completo:',
      '',
      bloques.join('\n\n'),
      '',
      textoTotal(items),
      '',
      '¿Me confirmas disponibilidad, costo y envío? ¡Gracias!'
    ].join('\n');
  }

  /* =====================================================
     DATOS DEL CATÁLOGO
  ===================================================== */

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
      coreana: true,
      nota: NOTA_MIXTO
    },
    {
      id: 'white-bouquet',
      categoria: 'mixtos',
      nombre: 'White Bouquet',
      img: 'white.jpeg',
      descripcion: 'Ramo de flores combinadas en tonos blancos.',
      tamanos: [
        'Mediano (28 flores)',
        'Grande (50 flores)'
      ],
      coreana: true
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
      coreana: true
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
      coreana: true,
      nota: 'Se pueden agregar flores extra. Pedidos con al menos 1 semana de anticipación.'
    },
    {
      id: 'arreglo-tess',
      categoria: 'rosas',
      nombre: 'Arreglo Tess',
      img: 'tres.jpeg',
      descripcion: 'Rosas con mini gerberas. El tono de la mini gerbera puede variar según disponibilidad.',
      tamanos: [
        'Chico (12 rosas en cascada)',
        'Mediano (24 rosas en cascada)',
        'Grande (50 rosas redondas)'
      ],
      colores: COLORES_ROSAS,
      nota: 'Solicitar con 1 día de anticipación.'
    },
    {
      id: 'bolsita-noellas',
      categoria: 'rosas',
      nombre: 'Bolsita Nöella’s',
      img: 'bolsita.jpeg',
      descripcion: 'Acompañada de rosas, gerberas, mini rosa, margarita y follaje.',
      tamanos: [
        'Único (12x15 cm aprox.)'
      ]
    },
    {
      id: 'rosas-gerberas',
      categoria: 'rosas',
      nombre: 'Rosas y Gerberas',
      img: 'genebras.jpeg',
      descripcion: 'Rosas, gerberas y follaje combinados.',
      tamanos: [
        'Mediano (24 rosas y gerberas)',
        'Grande (50 rosas y gerberas)'
      ],
      coreana: true
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
      coreana: true
    },
    {
      id: 'jarron-girasoles',
      categoria: 'girasoles',
      nombre: 'Jarrón de Girasoles',
      img: 'jg.jpeg',
      descripcion: '10 girasoles en base de cristal acompañados de follaje.',
      tamanos: [
        'Único (10 girasoles)'
      ]
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
      ]
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
      nota: 'Elección libre de tonalidades (indícalas en las notas). Solicitar con 1 día de anticipación. ' + NOTA_MIXTO
    },
    {
      id: 'cajita-mixta',
      categoria: 'jarrones',
      nombre: 'Cajita Mixta',
      img: 'cajitamixta.jpeg',
      descripcion: 'Caja de flores mixtas (vista frontal).',
      tamanos: [
        'Chica (20x14 cm aprox.)',
        'Mediana (35x14 cm aprox.)'
      ],
      nota: 'Solicitar con 1 día de anticipación. ' + NOTA_MIXTO
    },
    {
      id: 'canasta-noe-mar',
      categoria: 'jarrones',
      nombre: 'Canasta Noe Mar',
      img: 'canastanoemar.jpeg',
      descripcion: 'Mix de flores del día.',
      tamanos: [
        'Chica (12x12 cm)',
        'Mediana (25x20 cm)'
      ],
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
      nota: 'Se solicitan con al menos 3 horas de anticipación.'
    }

  ];

  /* =====================================================
     ENVÍO: el formulario vive en envio.html
     Aquí solo se guarda el pedido pendiente y se redirige.
  ===================================================== */

  const CLAVE_ENVIO = 'noellas_envio_pendiente';

  function irAEnvio(items, modo) {
    try {
      sessionStorage.setItem(CLAVE_ENVIO, JSON.stringify({
        modo: modo,
        items: items
      }));
    } catch (error) {
      alert('No se pudo continuar. Activa el almacenamiento del navegador e inténtalo de nuevo.');
      return;
    }

    window.location.href = 'envio.html';
  }

  /* =====================================================
     PRECIOS (mismo orden que "tamanos" de cada producto)
  ===================================================== */

  const COREANA = 150;

  const PRECIOS = {
    'bouquets-mixtos': [480, 690, 1200, 2500],
    'white-bouquet': [720, 1200],
    'ramo-hortensia': [690],
    'gerberas': [510, 990],
    'lirios': [700],
    'tulipanes': [1100, 1900],
    'rosas-clasicos': [480, 690, 1200, 2500],
    'rosas-inglesas': [990],
    'arreglo-tess': [720, 920, 1450],
    'bolsita-noellas': [650],
    'rosas-gerberas': [1100, 1600],
    'rosas-lisianthus': [1100, 1600],
    'girasoles-ramo': [650],
    'jarron-girasoles': [910],
    'jarron-mixto': [720, 950, 1420],
    'jarron-cherry': [890, 1100, 1690],
    'hortensia-base': [1350],
    'ceramica-mixta': [1300],
    'cajita-mixta': [720, 900],
    'canasta-noe-mar': [430, 610],
    'coffee-flowers': [420]
    // 'coronas': sin precio fijo, se cotiza por WhatsApp
  };

  function dinero(numero) {
    return '$' + numero.toLocaleString('es-MX') + ' MXN';
  }

  function buscarProducto(id) {
    return PRODUCTOS.find(function (producto) {
      return producto.id === id;
    });
  }

  function precioBase(id, tamano) {
    const producto = buscarProducto(id);
    const lista = PRECIOS[id];

    if (!producto || !lista) {
      return null;
    }

    const indice = producto.tamanos.indexOf(tamano);

    if (indice === -1 || typeof lista[indice] !== 'number') {
      return null;
    }

    return lista[indice];
  }

  function precioUnitario(item) {
    const base = precioBase(item.id, item.tamano);

    if (base === null) {
      return null;
    }

    return base + (item.coreana ? COREANA : 0);
  }

  function htmlPrecio(producto, tamano, coreana) {
    const lista = PRECIOS[producto.id];
    const consultar = '<span class="precio-aviso">Precio: consultar por WhatsApp</span>';

    if (!lista) {
      return consultar;
    }

    if (tamano) {
      const base = precioBase(producto.id, tamano);

      if (base === null) {
        return consultar;
      }

      return '<span class="precio-etiqueta">Precio</span> <strong>' +
        dinero(base + (coreana ? COREANA : 0)) + '</strong>' +
        (coreana ? ' <small>(incluye envoltura coreana)</small>' : '');
    }

    return '<span class="precio-etiqueta">Desde</span> <strong>' +
      dinero(Math.min.apply(null, lista)) + '</strong>';
  }

  function actualizarPrecio(tarjeta) {
    const producto = buscarProducto(tarjeta.dataset.producto);
    const caja = tarjeta.querySelector('.precio-tarjeta');

    if (!producto || !caja) {
      return;
    }

    const coreana = campo(tarjeta, 'coreana');

    caja.innerHTML = htmlPrecio(
      producto,
      campo(tarjeta, 'tamano').value,
      coreana ? coreana.checked : false
    );
  }

  function lineaPrecio(item) {
    const unitario = precioUnitario(item);

    if (unitario === null) {
      return '• Precio: por cotizar';
    }

    if (item.cantidad > 1) {
      return '• Precio: ' + dinero(unitario) + ' c/u (' + dinero(unitario * item.cantidad) + ')';
    }

    return '• Precio: ' + dinero(unitario);
  }

  function sumaCarrito(items) {
    let suma = 0;
    let sinPrecio = 0;

    items.forEach(function (item) {
      const unitario = precioUnitario(item);

      if (unitario === null) {
        sinPrecio += item.cantidad;
      } else {
        suma += unitario * item.cantidad;
      }
    });

    return { suma: suma, sinPrecio: sinPrecio };
  }

  function textoTotal(items) {
    const resultado = sumaCarrito(items);

    return '*Total estimado: ' + dinero(resultado.suma) + '* (sin envío)' +
      (resultado.sinPrecio ? ' + ' + resultado.sinPrecio + ' pieza(s) por cotizar' : '');
  }

  /* =====================================================
     CATÁLOGO: RENDER
  ===================================================== */

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
            <p class="precio-tarjeta" aria-live="polite">${htmlPrecio(producto, producto.tamanos.length === 1 ? producto.tamanos[0] : '', false)}</p>
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
                min="${hoyISO()}"
                placeholder="Elige una fecha"
              >
              <label class="form-label" for="${id}-horario">Horario</label>
              <select class="form-select" id="${id}-horario" data-campo="horario">
                ${opciones(HORARIOS, 'Elige un horario')}
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

  /* =====================================================
     CATÁLOGO: CALENDARIO SIN DOMINGOS
  ===================================================== */

  function cargarScript(src, alTerminar) {
    const script = document.createElement('script');

    script.src = src;
    script.onload = alTerminar;
    script.onerror = alTerminar;
    document.head.appendChild(script);
  }

  function cargarFlatpickr(alTerminar) {
    if (window.flatpickr) {
      alTerminar();
      return;
    }

    const estilos = document.createElement('link');

    estilos.rel = 'stylesheet';
    estilos.href = FLATPICKR + 'flatpickr.min.css';
    document.head.appendChild(estilos);

    cargarScript(FLATPICKR + 'flatpickr.min.js', function () {
      cargarScript(FLATPICKR + 'l10n/es.js', alTerminar);
    });
  }

  function iniciarCalendarios(lista) {
    if (!window.flatpickr) {
      return;
    }

    const idioma = window.flatpickr.l10ns && window.flatpickr.l10ns.es ? 'es' : 'default';

    lista.querySelectorAll('[data-campo="fecha"]').forEach(function (entrada) {
      window.flatpickr(entrada, {
        locale: idioma,
        minDate: 'today',
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'l j \\d\\e F \\d\\e Y',
        altInputClass: 'form-control',
        disableMobile: true,
        disable: [
          function (fecha) {
            return fecha.getDay() === 0;
          }
        ],
        onChange: function () {
          const tarjeta = entrada.closest('.tarjeta');
          mostrarError(tarjeta, []);
        }
      });
    });
  }

  /* =====================================================
     CATÁLOGO: LÓGICA DE TARJETA
  ===================================================== */

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

    caja.innerHTML = 'Agregado al carrito ✓ <a href="#carrito-panel" data-bs-toggle="offcanvas" role="button">Ver carrito</a>';
    caja.hidden = false;

    setTimeout(function () {
      caja.hidden = true;
    }, 5000);
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

    const errorFecha = validarFecha(fecha);

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

  function iniciarCatalogo() {
    const pagina = (location.pathname.split('/').pop() || '').toLowerCase().replace('.html', '');
    let lista = document.getElementById('catalogo-lista');

    if (!lista && pagina !== 'catalogo') {
      return;
    }

    if (!lista) {
      const base = document.querySelector('main .seccion .container') || document.querySelector('main');
      const extras = document.getElementById('extras');

      base.querySelectorAll('section.categoria').forEach(function (seccion) {
        if (seccion.id !== 'extras') {
          seccion.remove();
        }
      });

      lista = document.createElement('div');
      lista.id = 'catalogo-lista';

      if (extras) {
        extras.parentNode.insertBefore(lista, extras);
      } else {
        base.appendChild(lista);
      }
    }

    lista.innerHTML = CATEGORIAS.map(categoriaHTML).join('');

    if (location.hash) {
      try {
        const destino = document.querySelector(location.hash);

        if (destino) {
          destino.scrollIntoView();
        }
      } catch (error) {
        // hash no válido
      }
    }

    lista.addEventListener('click', function (evento) {
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
        irAEnvio([item], 'individual');
        return;
      }

      agregar(item);
      mostrarOk(tarjeta);
    });

    lista.addEventListener('change', function (evento) {
      const entrada = evento.target;

      if (entrada.matches('[data-campo="tamano"], [data-campo="coreana"]')) {
        actualizarPrecio(entrada.closest('.tarjeta'));
        return;
      }

      if (!entrada.matches('[data-campo="fecha"]')) {
        return;
      }

      const tarjeta = entrada.closest('.tarjeta');
      const error = validarFecha(entrada.value);

      if (error && entrada.value) {
        entrada.value = '';
        mostrarError(tarjeta, [error]);
        return;
      }

      mostrarError(tarjeta, []);
    });

    cargarFlatpickr(function () {
      iniciarCalendarios(lista);
    });
  }

  /* =====================================================
     CARRITO: VISTA (PANEL LATERAL)
  ===================================================== */

  function detalleItem(item) {
    return [
      '<li><strong>Tamaño:</strong> ' + esc(item.tamano) + '</li>',
      item.color ? '<li><strong>Color:</strong> ' + esc(item.color) + '</li>' : '',
      item.coreana ? '<li><strong>Envoltura coreana:</strong> Sí (+$150 MXN)</li>' : '',
      '<li><strong>Fecha:</strong> ' + esc(formatoFecha(item.fecha)) + '</li>',
      '<li><strong>Horario:</strong> ' + esc(item.horario) + '</li>',
      item.notas ? '<li><strong>Notas:</strong> ' + esc(item.notas) + '</li>' : ''
    ].join('');
  }

  function precioCarritoHTML(item) {
    const unitario = precioUnitario(item);

    if (unitario === null) {
      return '<span class="precio-aviso">Por cotizar</span>';
    }

    return '<strong>' + dinero(unitario * item.cantidad) + '</strong>' +
      (item.cantidad > 1 ? ' <small>(' + dinero(unitario) + ' c/u)</small>' : '');
  }

  function itemCarritoHTML(item) {
    return `
      <article class="carrito-item" data-uid="${esc(item.uid)}">
        <img
          src="assets/img/${esc(item.img)}"
          alt="${esc(item.nombre)}"
        >
        <div class="carrito-info">
          <h3>${esc(item.nombre)}</h3>
          <p class="carrito-precio">${precioCarritoHTML(item)}</p>
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

  function carritoVacioHTML() {
    return `
      <div class="carrito-vacio">
        <h3 class="h5">Tu carrito está vacío</h3>
        <p>Explora el catálogo y agrega tus arreglos favoritos.</p>
        <a href="catalogo.html" class="btn btn-rosa">Ver catálogo</a>
      </div>`;
  }

  function resumenHTML(items) {
    return `
      <div class="carrito-resumen">
        <p class="mb-1">
          <strong>Piezas en tu pedido:</strong>
          ${total(items)}
        </p>
        <p class="carrito-total mb-1">
          <strong>Total estimado:</strong>
          ${dinero(sumaCarrito(items).suma)}
          ${sumaCarrito(items).sinPrecio ? '<small>+ ' + sumaCarrito(items).sinPrecio + ' pieza(s) por cotizar</small>' : ''}
        </p>
        <p class="small">
          Total sin envío. El envío ($85 a $150 MXN según tu zona) y el costo final se confirman por WhatsApp.
        </p>
        <div class="error-envio form-error mb-3" role="alert" hidden></div>
        <div class="d-grid gap-2">
          <button type="button" class="btn btn-rosa" data-accion="enviar">
            Enviar pedido completo por WhatsApp
          </button>
          <button type="button" class="btn btn-linea" data-accion="vaciar">
            Vaciar carrito
          </button>
        </div>
      </div>`;
  }

  function iniciarCarrito() {
    const vista = document.getElementById('carrito-vista');

    if (!vista) {
      return;
    }

    function render() {
      const items = leer();

      if (!items.length) {
        vista.innerHTML = carritoVacioHTML();
        return;
      }

      vista.innerHTML = items.map(itemCarritoHTML).join('') + resumenHTML(items);
    }

    function enviar() {
      const items = leer();
      const caja = vista.querySelector('.error-envio');
      const problemas = [];

      items.forEach(function (item) {
        const error = validarFecha(item.fecha);
        const tarjeta = vista.querySelector('[data-uid="' + item.uid + '"]');

        if (tarjeta) {
          tarjeta.classList.toggle('item-invalido', Boolean(error));
        }

        if (error) {
          problemas.push(item.nombre + ': ' + error);
        }
      });

      if (problemas.length) {
        caja.innerHTML = problemas.map(esc).join('<br>') + '<br>Quita el producto y agrégalo de nuevo con una fecha válida.';
        caja.hidden = false;
        return;
      }

      irAEnvio(items, 'carrito');
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
        cambiarCantidad(uid, 1);
      }

      if (accion === 'menos') {
        cambiarCantidad(uid, -1);
      }

      if (accion === 'quitar') {
        quitar(uid);
      }

      if (accion === 'vaciar') {
        vaciar();
      }

      if (accion === 'enviar') {
        enviar();
      }
    });

    document.addEventListener('carrito:cambio', render);
    window.addEventListener('storage', render);

    render();
  }

  /* =====================================================
     API GLOBAL Y ARRANQUE
  ===================================================== */

  window.Noellas = {
    abrirWhatsApp: abrirWhatsApp,
    actualizarContador: actualizarContador,
    esc: esc,
    formatoFecha: formatoFecha,
    mensajeIndividual: mensajeIndividual,
    mensajeCarrito: mensajeCarrito,
    carrito: {
      obtener: leer,
      agregar: agregar,
      quitar: quitar,
      vaciar: vaciar
    }
  };

  document.addEventListener('click', function (evento) {
    const elemento = evento.target.closest('[data-wa]');

    if (!elemento) {
      return;
    }

    evento.preventDefault();
    abrirWhatsApp(elemento.dataset.wa);
  });

  window.addEventListener('storage', actualizarContador);

  listo(function () {
    actualizarContador();
    iniciarCarrito();
    iniciarCatalogo();
  });

})();
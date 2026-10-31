
/*
 * GLOX3R - Funcionalidades compartidas:
 * carrito, buscador, menú móvil, almacenamiento e imágenes.
 *
 * Requiere que catalogo.js se cargue antes.
 */
(function () {
  'use strict';

  // ---------- CATÁLOGO ----------
  var C = window.GLOX3R_CATALOGO;

  if (!C || !Array.isArray(C.PRODUCTOS)) {
    console.error('GLOX3R: no se pudo cargar el catálogo de productos.');
    return;
  }

  var CLAVE_CARRITO = 'glox3r_carrito';
  var ENVIO_ESTANDAR = 1500;
  var ENVIO_EXPRESS = 2500;
  var MAX_CANTIDAD = 99;

  // Obtener la raíz del proyecto desde la ubicación de app.js.
  var scriptActual = document.currentScript;
  var RAIZ = new URL('../', scriptActual.src).href;

  // Crear un índice para localizar productos mediante su ID.
  var porId = {};

  C.PRODUCTOS.forEach(function (p) {
    if (!p || !p.id) return;

    if (porId[p.id]) {
      console.warn('GLOX3R: identificador duplicado:', p.id);
    }

    porId[p.id] = p;
  });

  // ---------- ALMACENAMIENTO ----------
  var memoria = {};

  function leer(clave, defecto) {
    try {
      var valor = window.localStorage.getItem(clave);

      return valor !== null
        ? JSON.parse(valor)
        : defecto;

    } catch (error) {
      return clave in memoria ? memoria[clave] : defecto;
    }
  }

  function guardar(clave, valor) {
    memoria[clave] = valor;

    try {
      window.localStorage.setItem(
        clave,
        JSON.stringify(valor)
      );

      return true;

    } catch (error) {
      return false;
    }
  }

  function borrar(clave) {
    delete memoria[clave];

    try {
      window.localStorage.removeItem(clave);
    } catch (error) {
      // El almacenamiento puede estar bloqueado.
    }
  }

  // ---------- UTILIDADES ----------
  function centimos(precio) {
    return Math.round(Number(precio) * 100);
  }

  function formatear(cantidad) {
    return 'S/' + (cantidad / 100).toFixed(2);
  }

  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function el(tag, clase, texto) {
    var elemento = document.createElement(tag);

    if (clase) {
      elemento.className = clase;
    }

    if (texto !== undefined) {
      elemento.textContent = texto;
    }

    return elemento;
  }

  // ---------- IMÁGENES ----------
  /*
   * Convierte las rutas locales en direcciones válidas
   * desde cualquier página del proyecto.
   *
   * Ejemplo:
   * ../img/Polo Boxy Fit.jpeg
   * se resolverá desde la raíz del proyecto.
   */
  function resolverRutaImagen(ruta) {
    if (!ruta) return '';

    ruta = String(ruta).trim();

    // Mantener imágenes externas y direcciones especiales.
    if (
      /^(https?:)?\/\//i.test(ruta) ||
      /^(data|blob):/i.test(ruta)
    ) {
      return ruta;
    }

    // Quitar ../, ./ y barras iniciales.
    ruta = ruta
      .replace(/^(\.\.\/)+/, '')
      .replace(/^\.\/+/, '')
      .replace(/^\/+/, '');

    return new URL(ruta, RAIZ).href;
  }

  function crearImagenAlternativa(p, clase) {
    var bloque = el(
      'div',
      (clase ? clase + ' ' : '') + 'imagen-neutra'
    );

    bloque.setAttribute('role', 'img');
    bloque.setAttribute(
      'aria-label',
      p.nombre + ' (imagen no disponible)'
    );

    bloque.appendChild(
      el('span', '', p.nombre)
    );

    return bloque;
  }

  function crearImagen(p, clase) {
    // Si no existe una imagen, mostrar un bloque alternativo.
    if (!p.imagen) {
      return crearImagenAlternativa(p, clase);
    }

    var img = el('img', clase || '');

    img.alt = p.nombre;
    img.loading = 'lazy';

    img.src = resolverRutaImagen(p.imagen);

    // Si la ruta es incorrecta, mostrar una alternativa.
    img.addEventListener('error', function () {
      if (img.parentNode) {
        img.parentNode.replaceChild(
          crearImagenAlternativa(p, clase),
          img
        );
      }
    }, { once: true });

    return img;
  }

  // ---------- CARRITO ----------
  function cargarCarrito() {
    var guardado = leer(CLAVE_CARRITO, []);

    if (!Array.isArray(guardado)) {
      return [];
    }

    var vistos = {};
    var lineas = [];

    guardado.forEach(function (linea) {
      if (
        !linea ||
        !porId[linea.id] ||
        vistos[linea.id]
      ) {
        return;
      }

      vistos[linea.id] = true;

      var producto = porId[linea.id];
      var cantidad = parseInt(linea.cantidad, 10);

      if (!(cantidad >= 1)) {
        cantidad = 1;
      }

      cantidad = Math.min(MAX_CANTIDAD, cantidad);

      var tallas = C.TALLAS[producto.tipo] || [];
      var tallaDefecto =
        C.TALLA_DEFECTO[producto.tipo] || tallas[0] || '';

      var talla = tallas.indexOf(linea.talla) >= 0
        ? linea.talla
        : tallaDefecto;

      lineas.push({
        id: linea.id,
        cantidad: cantidad,
        talla: talla
      });
    });

    return lineas;
  }

  var lineas = cargarCarrito();

  function buscarLinea(id) {
    return lineas.find(function (linea) {
      return linea.id === id;
    }) || null;
  }

  function persistir() {
    var guardado = guardar(CLAVE_CARRITO, lineas);

    document.dispatchEvent(
      new CustomEvent('glox3r:carrito')
    );

    actualizarInsignia();

    return guardado;
  }

  var carrito = {

    lineas: function () {
      return lineas.map(function (linea) {
        return {
          id: linea.id,
          cantidad: linea.cantidad,
          talla: linea.talla,
          producto: porId[linea.id]
        };
      });
    },

    cantidadTotal: function () {
      return lineas.reduce(function (total, linea) {
        return total + linea.cantidad;
      }, 0);
    },

    agregar: function (id) {
      var producto = porId[id];

      if (!producto) {
        return false;
      }

      var linea = buscarLinea(id);

      if (linea) {
        linea.cantidad = Math.min(
          MAX_CANTIDAD,
          linea.cantidad + 1
        );

      } else {
        var tallas = C.TALLAS[producto.tipo] || [];
        var talla = C.TALLA_DEFECTO[producto.tipo] ||
          tallas[0] || '';

        lineas.push({
          id: id,
          cantidad: 1,
          talla: talla
        });
      }

      return persistir();
    },

    cambiarCantidad: function (id, cantidad) {
      var linea = buscarLinea(id);

      if (!linea) return;

      cantidad = parseInt(cantidad, 10);

      if (!(cantidad >= 1)) {
        cantidad = 1;
      }

      linea.cantidad = Math.min(
        MAX_CANTIDAD,
        cantidad
      );

      persistir();
    },

    cambiarTalla: function (id, talla) {
      var linea = buscarLinea(id);

      if (!linea) return;

      var producto = porId[id];
      var tallas = C.TALLAS[producto.tipo] || [];

      if (tallas.indexOf(talla) >= 0) {
        linea.talla = talla;
        persistir();
      }
    },

    eliminar: function (id) {
      lineas = lineas.filter(function (linea) {
        return linea.id !== id;
      });

      persistir();
    },

    vaciar: function () {
      lineas = [];
      persistir();
    },

    totales: function (envio) {
      var subtotal = lineas.reduce(function (total, linea) {
        var producto = porId[linea.id];

        return total +
          centimos(producto.precio) * linea.cantidad;
      }, 0);

      if (envio === undefined) {
        envio = lineas.length ? ENVIO_ESTANDAR : 0;
      }

      return {
        subtotal: subtotal,
        envio: envio,
        total: subtotal + envio
      };
    }
  };

  // Sincronizar el carrito entre pestañas.
  window.addEventListener('storage', function (evento) {
    if (evento.key === CLAVE_CARRITO) {
      lineas = cargarCarrito();

      actualizarInsignia();

      document.dispatchEvent(
        new CustomEvent('glox3r:carrito')
      );
    }
  });

  // ---------- AVISOS ----------
  var temporizadorAviso = null;

  function aviso(texto) {
    var toast = document.getElementById('aviso-glox3r');

    if (!toast) {
      toast = el('div', 'aviso-glox3r');
      toast.id = 'aviso-glox3r';

      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');

      document.body.appendChild(toast);
    }

    toast.textContent = texto;
    toast.classList.add('visible');

    clearTimeout(temporizadorAviso);

    temporizadorAviso = setTimeout(function () {
      toast.classList.remove('visible');
    }, 2400);
  }

  // ---------- CONTADOR DEL CARRITO ----------
  function actualizarInsignia() {
    var cantidad = carrito.cantidadTotal();

    var enlaces = document.querySelectorAll(
      '.navbar a.icono[href$="carrito_1.html"]'
    );

    Array.prototype.forEach.call(enlaces, function (enlace) {
      var insignia = enlace.querySelector(
        '.insignia-carrito'
      );

      if (!insignia) {
        insignia = el('span', 'insignia-carrito');

        insignia.setAttribute(
          'aria-hidden',
          'true'
        );

        enlace.appendChild(insignia);
      }

      insignia.textContent =
        cantidad > 99 ? '99+' : String(cantidad);

      insignia.hidden = cantidad === 0;

      enlace.setAttribute(
        'aria-label',
        cantidad
          ? 'Ver carrito de compras (' + cantidad +
            (cantidad === 1 ? ' artículo)' : ' artículos)')
          : 'Ver carrito de compras'
      );
    });
  }

  // ---------- BUSCADOR ----------
  function buscar(consulta) {
    var terminos = normalizar(consulta)
      .split(/\s+/)
      .filter(Boolean);

    if (!terminos.length) {
      return [];
    }

    return C.PRODUCTOS.filter(function (producto) {
      var categorias = (producto.categorias || [])
        .map(function (categoria) {
          return C.ETIQUETAS[categoria] || categoria;
        })
        .join(' ');

      var texto = normalizar(
        producto.nombre + ' ' + categorias
      );

      return terminos.every(function (termino) {
        return texto.indexOf(termino) !== -1;
      });
    });
  }

  function iniciarBuscador() {
    var formularios = document.querySelectorAll(
      '.navbar form[role="search"]'
    );

    Array.prototype.forEach.call(formularios, function (formulario) {

      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        var input = formulario.querySelector(
          'input[name="q"]'
        );

        var consulta = input
          ? input.value.trim()
          : '';

        if (!consulta) {
          if (input) input.focus();
          return;
        }

        window.location.href =
          RAIZ + 'html/buscar.html?q=' +
          encodeURIComponent(consulta);
      });

    });
  }

  // ---------- MENÚ MÓVIL ----------
  function iniciarMenu() {
    var barra = document.querySelector('.navbar');

    var boton = document.querySelector(
      '.navbar .menu-icon'
    );

    if (!barra || !boton) {
      return;
    }

    function alternar(abrir) {
      barra.classList.toggle('menu-abierto', abrir);

      boton.setAttribute(
        'aria-expanded',
        abrir ? 'true' : 'false'
      );

      boton.setAttribute(
        'aria-label',
        abrir
          ? 'Cerrar menú de navegación'
          : 'Abrir menú de navegación'
      );
    }

    boton.addEventListener('click', function () {
      alternar(
        !barra.classList.contains('menu-abierto')
      );
    });

    document.addEventListener('keydown', function (evento) {
      if (
        evento.key === 'Escape' &&
        barra.classList.contains('menu-abierto')
      ) {
        alternar(false);
        boton.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) {
        alternar(false);
      }
    });
  }

  // ---------- TARJETAS PARA RESULTADOS DE BÚSQUEDA ----------
  function crearTarjeta(producto, mostrarCategorias) {
    var tarjeta = el('div', 'producto-carta');

    tarjeta.appendChild(
      crearImagen(producto, 'imagen-producto')
    );

    var informacion = el(
      'div',
      'informacion-producto'
    );

    informacion.appendChild(
      el('h3', 'nombre-producto', producto.nombre)
    );

    if (mostrarCategorias) {
      var etiquetas = (producto.categorias || [])
        .map(function (categoria) {
          return C.ETIQUETAS[categoria] || categoria;
        })
        .join(' · ');

      informacion.appendChild(
        el('span', 'etiqueta-categoria', etiquetas)
      );
    }

    informacion.appendChild(
      el(
        'span',
        'precio-producto',
        'S/ ' + Number(producto.precio).toFixed(2)
      )
    );

    var boton = el(
      'button',
      'boton-carrito',
      'Agregar al carrito'
    );

    boton.type = 'button';

    boton.setAttribute(
      'data-agregar',
      producto.id
    );

    boton.setAttribute(
      'aria-label',
      'Agregar ' + producto.nombre + ' al carrito'
    );

    informacion.appendChild(boton);
    tarjeta.appendChild(informacion);

    return tarjeta;
  }

  /*
   * Solo genera tarjetas cuando existe expresamente
   * un contenedor con data-catalogo.
   *
   * Tus catálogos actuales están escritos directamente
   * en HTML y no serán reemplazados por esta función.
   */
  function dibujarCatalogos() {
    var contenedores = document.querySelectorAll(
      '[data-catalogo]'
    );

    Array.prototype.forEach.call(contenedores, function (contenedor) {
      var categoria = contenedor.getAttribute(
        'data-catalogo'
      );

      var productos = C.PRODUCTOS.filter(function (producto) {
        return (
          producto.catalogos &&
          producto.catalogos.indexOf(categoria) >= 0
        );
      });

      contenedor.textContent = '';

      if (!productos.length) {
        contenedor.appendChild(
          el(
            'p',
            'mensaje-vacio',
            'Pronto habrá productos en esta sección.'
          )
        );

        return;
      }

      productos.forEach(function (producto) {
        contenedor.appendChild(
          crearTarjeta(producto, false)
        );
      });
    });
  }

  // ---------- BOTONES AGREGAR AL CARRITO ----------
  /*
   * Se utiliza delegación de eventos:
   * cualquier botón con data-agregar funcionará,
   * incluso si aparece posteriormente en el documento.
   */
  document.addEventListener('click', function (evento) {
    var objetivo = evento.target;

    if (objetivo.nodeType !== 1) {
      objetivo = objetivo.parentElement;
    }

    if (!objetivo) return;

    var boton = objetivo.closest('[data-agregar]');

    if (!boton || boton.disabled) {
      return;
    }

    var id = boton.getAttribute('data-agregar');
    var producto = porId[id];

    if (!producto) {
      console.error(
        'GLOX3R: producto no encontrado:',
        id
      );

      aviso('Este producto no está disponible.');

      return;
    }

    var guardado = carrito.agregar(id);

    if (guardado) {
      aviso(
        producto.nombre + ' se agregó al carrito'
      );
    } else {
      aviso(
        producto.nombre +
        ' se agregó, pero no se pudo guardar en este navegador.'
      );
    }
  });

  // ---------- VALIDACIÓN DE FORMULARIOS ----------
  function errorCampo(input, mensaje) {
    var idError = (input.id || input.name) + '-error';

    var error = document.getElementById(idError);

    if (!error) {
      error = el('span', 'error-campo');
      error.id = idError;

      var ancla = input.closest('.fila-inputs') || input;

      while (
        ancla.nextElementSibling &&
        ancla.nextElementSibling.classList.contains('error-campo')
      ) {
        ancla = ancla.nextElementSibling;
      }

      ancla.insertAdjacentElement('afterend', error);
    }

    error.textContent = mensaje || '';

    if (mensaje) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', idError);

    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }

    return !mensaje;
  }

  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_NOMBRE = /^[\p{L}][\p{L}\s'.-]*$/u;

  // ---------- API PÚBLICA ----------
  /*
   * Otros archivos utilizan estas funciones.
   * Por eso mantenemos sus nombres y estructura.
   */
  window.GLOX3R = {
    RAIZ: RAIZ,
    C: C,
    porId: porId,
    carrito: carrito,

    ENVIO_ESTANDAR: ENVIO_ESTANDAR,
    ENVIO_EXPRESS: ENVIO_EXPRESS,
    MAX_CANTIDAD: MAX_CANTIDAD,

    leer: leer,
    guardar: guardar,
    borrar: borrar,

    formatear: formatear,
    centimos: centimos,
    normalizar: normalizar,
    el: el,

    crearImagen: crearImagen,
    crearTarjeta: crearTarjeta,
    buscar: buscar,
    aviso: aviso,

    errorCampo: errorCampo,
    RE_CORREO: RE_CORREO,
    RE_NOMBRE: RE_NOMBRE
  };

  // ---------- INICIALIZACIÓN ----------
  function iniciarAplicacion() {
    iniciarMenu();
    iniciarBuscador();
    dibujarCatalogos();
    actualizarInsignia();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      iniciarAplicacion
    );
  } else {
    iniciarAplicacion();
  }

})();

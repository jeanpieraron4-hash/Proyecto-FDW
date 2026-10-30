/*
 * GLOX3R - Lógica compartida por todas las páginas:
 * menú móvil, buscador (Enter), carrito con localStorage, avisos y catálogos dinámicos.
 * Requiere js/catalogo.js cargado antes.
 */
(function () {
  'use strict';

  var C = window.GLOX3R_CATALOGO;
  if (!C) { console.error('GLOX3R: falta js/catalogo.js'); return; }

  var CLAVE_CARRITO = 'glox3r_carrito';
  var ENVIO_ESTANDAR = 1500; // céntimos (S/15.00)
  var ENVIO_EXPRESS = 2500;  // céntimos (S/25.00)
  var MAX_CANTIDAD = 99;

  // Raíz del sitio, calculada desde la ruta de este script (js/app.js -> ../).
  var RAIZ = new URL('../', document.currentScript.src).href;

  var porId = {};
  C.PRODUCTOS.forEach(function (p) { porId[p.id] = p; });

  /* ---------- almacenamiento seguro ---------- */
  var memoria = {}; // respaldo si localStorage no está disponible
  function leer(clave, defecto) {
    try {
      var v = window.localStorage.getItem(clave);
      return v ? JSON.parse(v) : defecto;
    } catch (e) {
      return clave in memoria ? memoria[clave] : defecto;
    }
  }
  function guardar(clave, valor) {
    memoria[clave] = valor;
    try { window.localStorage.setItem(clave, JSON.stringify(valor)); return true; }
    catch (e) { return false; }
  }
  function borrar(clave) {
    delete memoria[clave];
    try { window.localStorage.removeItem(clave); } catch (e) { /* sin acceso */ }
  }

  /* ---------- utilidades ---------- */
  function centimos(precio) { return Math.round(precio * 100); }
  function formatear(c) { return 'S/' + (c / 100).toFixed(2); }
  function normalizar(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }
  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }

  /** Imagen del producto o bloque neutro con su nombre si aún no hay foto. */
  function crearImagen(p, clase) {
    if (p.imagen) {
      var img = el('img', clase || '');
      img.src = p.imagen;
      img.alt = p.nombre;
      img.loading = 'lazy';
      return img;
    }
    var bloque = el('div', (clase ? clase + ' ' : '') + 'imagen-neutra');
    bloque.setAttribute('role', 'img');
    bloque.setAttribute('aria-label', p.nombre + ' (imagen no disponible)');
    bloque.appendChild(el('span', '', p.nombre));
    return bloque;
  }

  /* ---------- carrito ---------- */
  function cargarCarrito() {
    var crudo = leer(CLAVE_CARRITO, []);
    if (!Array.isArray(crudo)) return [];
    var vistos = {};
    var lineas = [];
    crudo.forEach(function (l) {
      if (!l || !porId[l.id] || vistos[l.id]) return;
      vistos[l.id] = true;
      var p = porId[l.id];
      var cant = parseInt(l.cantidad, 10);
      if (!(cant >= 1)) cant = 1;
      lineas.push({
        id: l.id,
        cantidad: Math.min(MAX_CANTIDAD, cant),
        talla: C.TALLAS[p.tipo].indexOf(l.talla) >= 0 ? l.talla : C.TALLA_DEFECTO[p.tipo]
      });
    });
    return lineas;
  }

  var lineas = cargarCarrito();

  function persistir() {
    var ok = guardar(CLAVE_CARRITO, lineas);
    document.dispatchEvent(new CustomEvent('glox3r:carrito'));
    actualizarInsignia();
    return ok;
  }
  function buscarLinea(id) {
    for (var i = 0; i < lineas.length; i++) if (lineas[i].id === id) return lineas[i];
    return null;
  }

  var carrito = {
    lineas: function () { return lineas.map(function (l) { return { id: l.id, cantidad: l.cantidad, talla: l.talla, producto: porId[l.id] }; }); },
    cantidadTotal: function () { return lineas.reduce(function (s, l) { return s + l.cantidad; }, 0); },
    agregar: function (id) {
      var p = porId[id];
      if (!p) return false;
      var l = buscarLinea(id);
      if (l) l.cantidad = Math.min(MAX_CANTIDAD, l.cantidad + 1);
      else lineas.push({ id: id, cantidad: 1, talla: C.TALLA_DEFECTO[p.tipo] });
      return persistir();
    },
    cambiarCantidad: function (id, n) {
      var l = buscarLinea(id);
      if (!l) return;
      n = parseInt(n, 10);
      if (!(n >= 1)) n = 1;
      l.cantidad = Math.min(MAX_CANTIDAD, n);
      persistir();
    },
    cambiarTalla: function (id, talla) {
      var l = buscarLinea(id);
      if (l && C.TALLAS[porId[id].tipo].indexOf(talla) >= 0) { l.talla = talla; persistir(); }
    },
    eliminar: function (id) {
      lineas = lineas.filter(function (l) { return l.id !== id; });
      persistir();
    },
    vaciar: function () { lineas = []; persistir(); },
    totales: function (envio) {
      var subtotal = lineas.reduce(function (s, l) { return s + centimos(porId[l.id].precio) * l.cantidad; }, 0);
      if (envio === undefined) envio = lineas.length ? ENVIO_ESTANDAR : 0;
      return { subtotal: subtotal, envio: envio, total: subtotal + envio };
    }
  };

  window.addEventListener('storage', function (e) {
    if (e.key === CLAVE_CARRITO) {
      lineas = cargarCarrito();
      actualizarInsignia();
      document.dispatchEvent(new CustomEvent('glox3r:carrito'));
    }
  });

  /* ---------- aviso (toast) ---------- */
  var temporizadorAviso = null;
  function aviso(texto) {
    var t = document.getElementById('aviso-glox3r');
    if (!t) {
      t = el('div', 'aviso-glox3r');
      t.id = 'aviso-glox3r';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = texto;
    t.classList.add('visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () { t.classList.remove('visible'); }, 2400);
  }

  /* ---------- insignia del carrito en la cabecera ---------- */
  function actualizarInsignia() {
    var n = carrito.cantidadTotal();
    var enlaces = document.querySelectorAll('.navbar a.icono[href$="carrito_1.html"]');
    Array.prototype.forEach.call(enlaces, function (a) {
      var b = a.querySelector('.insignia-carrito');
      if (!b) { b = el('span', 'insignia-carrito'); b.setAttribute('aria-hidden', 'true'); a.appendChild(b); }
      b.textContent = n > 99 ? '99+' : String(n);
      b.hidden = n === 0;
      a.setAttribute('aria-label', n ? 'Ver carrito de compras (' + n + (n === 1 ? ' artículo)' : ' artículos)') : 'Ver carrito de compras');
    });
  }

  /* ---------- buscador ---------- */
  function buscar(consulta) {
    var terminos = normalizar(consulta).split(/\s+/).filter(Boolean);
    if (!terminos.length) return [];
    return C.PRODUCTOS.filter(function (p) {
      var texto = normalizar(p.nombre + ' ' + p.categorias.map(function (c) { return C.ETIQUETAS[c]; }).join(' '));
      return terminos.every(function (t) { return texto.indexOf(t) >= 0; });
    });
  }

  function iniciarBuscador() {
    Array.prototype.forEach.call(document.querySelectorAll('.navbar form[role="search"]'), function (f) {
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var input = f.querySelector('input[name="q"]');
        var q = input ? input.value.trim() : '';
        if (!q) { if (input) input.focus(); return; }
        window.location.href = RAIZ + 'html/buscar.html?q=' + encodeURIComponent(q);
      });
    });
  }

  /* ---------- menú móvil ---------- */
  function iniciarMenu() {
    var barra = document.querySelector('.navbar');
    var boton = document.querySelector('.navbar .menu-icon');
    if (!barra || !boton) return;
    function alternar(abrir) {
      barra.classList.toggle('menu-abierto', abrir);
      boton.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      boton.setAttribute('aria-label', abrir ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    }
    boton.addEventListener('click', function () { alternar(!barra.classList.contains('menu-abierto')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && barra.classList.contains('menu-abierto')) { alternar(false); boton.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100) alternar(false); });
  }

  /* ---------- tarjetas de producto (catálogos y resultados) ---------- */
  function crearTarjeta(p, mostrarCategorias) {
    var carta = el('div', 'producto-carta');
    carta.appendChild(crearImagen(p, 'imagen-producto'));
    var info = el('div', 'informacion-producto');
    info.appendChild(el('h3', 'nombre-producto', p.nombre));
    if (mostrarCategorias) {
      info.appendChild(el('span', 'etiqueta-categoria', p.categorias.map(function (c) { return C.ETIQUETAS[c]; }).join(' · ')));
    }
    info.appendChild(el('span', 'precio-producto', 'S/ ' + p.precio.toFixed(2)));
    var b = el('button', 'boton-carrito', 'Agregar al carrito');
    b.type = 'button';
    b.setAttribute('data-agregar', p.id);
    b.setAttribute('aria-label', 'Agregar ' + p.nombre + ' al carrito');
    info.appendChild(b);
    carta.appendChild(info);
    return carta;
  }

  function dibujarCatalogos() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-catalogo]'), function (cont) {
      var cat = cont.getAttribute('data-catalogo');
      var lista = C.PRODUCTOS.filter(function (p) { return p.catalogos.indexOf(cat) >= 0; });
      cont.textContent = '';
      if (!lista.length) { cont.appendChild(el('p', 'mensaje-vacio', 'Pronto habrá productos en esta sección.')); return; }
      lista.forEach(function (p) { cont.appendChild(crearTarjeta(p, false)); });
    });
  }

  /* ---------- agregar al carrito (delegación de eventos) ---------- */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest ? ev.target.closest('[data-agregar]') : null;
    if (!b) return;
    var p = porId[b.getAttribute('data-agregar')];
    if (!p) { console.error('GLOX3R: producto no encontrado en el catálogo:', b.getAttribute('data-agregar')); aviso('Este producto no está disponible.'); return; }
    var ok = carrito.agregar(p.id);
    aviso(ok ? p.nombre + ' se agregó al carrito' : p.nombre + ' se agregó, pero este navegador no permite guardar el carrito.');
  });

  /* ---------- validación de formularios (utilidades compartidas) ---------- */
  function errorCampo(input, mensaje) {
    var idError = (input.id || input.name) + '-error';
    var e = document.getElementById(idError);
    if (!e) {
      e = el('span', 'error-campo');
      e.id = idError;
      var ancla = input.closest('.fila-inputs') || input;
      while (ancla.nextElementSibling && ancla.nextElementSibling.classList.contains('error-campo')) ancla = ancla.nextElementSibling;
      ancla.insertAdjacentElement('afterend', e);
    }
    e.textContent = mensaje || '';
    if (mensaje) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', idError); }
    else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    return !mensaje;
  }
  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_NOMBRE = /^[\p{L}][\p{L}\s'.-]*$/u;

  /* ---------- API pública ---------- */
  window.GLOX3R = {
    RAIZ: RAIZ, C: C, porId: porId, carrito: carrito,
    ENVIO_ESTANDAR: ENVIO_ESTANDAR, ENVIO_EXPRESS: ENVIO_EXPRESS, MAX_CANTIDAD: MAX_CANTIDAD,
    leer: leer, guardar: guardar, borrar: borrar,
    formatear: formatear, centimos: centimos, normalizar: normalizar, el: el,
    crearImagen: crearImagen, crearTarjeta: crearTarjeta, buscar: buscar, aviso: aviso,
    errorCampo: errorCampo, RE_CORREO: RE_CORREO, RE_NOMBRE: RE_NOMBRE
  };

  document.addEventListener('DOMContentLoaded', function () {
    iniciarMenu();
    iniciarBuscador();
    dibujarCatalogos();
    actualizarInsignia();
  });
})();

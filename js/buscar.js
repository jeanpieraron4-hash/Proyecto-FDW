/* GLOX3R - Página de resultados de búsqueda (html/buscar.html?q=...). */
(function () {
  'use strict';
  var G = window.GLOX3R;
  if (!G) return;

  var cont = document.getElementById('resultados');
  var resumen = document.getElementById('resumen-resultados');
  if (!cont || !resumen) return;

  var q = (new URLSearchParams(window.location.search).get('q') || '').trim();
  var campo = document.querySelector('.navbar form[role="search"] input[name="q"]');
  if (campo) campo.value = q;
  document.title = q ? 'GLOX3R - Buscar: ' + q : 'GLOX3R - Buscar';

  cont.textContent = '';
  if (!q) {
    resumen.textContent = 'Escribe lo que buscas en el cuadro de búsqueda y presiona Enter.';
    return;
  }
  var res = G.buscar(q);
  if (!res.length) {
    resumen.textContent = 'No encontramos productos para “' + q + '”. Prueba con otra palabra, por ejemplo “polo”, “jean” o “collar”.';
    return;
  }
  resumen.textContent = res.length + (res.length === 1 ? ' resultado' : ' resultados') + ' para “' + q + '”.';
  res.forEach(function (p) { cont.appendChild(G.crearTarjeta(p, true)); });
})();

/* GLOX3R - Confirmación: muestra el pedido guardado por el checkout. */
(function () {
  'use strict';
  var G = window.GLOX3R;
  var num = document.getElementById('orden-numero');
  if (!G || !num) return;

  var pedido = G.leer('glox3r_pedido', null);
  if (!pedido || !pedido.numero) {
    document.getElementById('orden-titulo').textContent = 'SIN PEDIDO RECIENTE';
    num.textContent = 'Aún no has completado ninguna compra.';
    ['orden-mensaje', 'orden-detalles'].forEach(function (id) { var n = document.getElementById(id); if (n) n.hidden = true; });
    return;
  }
  num.textContent = 'PEDIDO #' + pedido.numero;
  document.getElementById('orden-fecha').textContent = pedido.fecha;
  document.getElementById('orden-total').textContent = G.formatear(pedido.total);
})();

(function () {
  'use strict';
  var G = window.GLOX3R;
  var form = document.getElementById('form-contacto');
  if (!G || !form) return;

  var estado = document.getElementById('estado-contacto');
  var reglas = {
    nombre: function (v) { return !v.trim() ? 'Ingresa tu nombre.' : (G.RE_NOMBRE.test(v.trim()) && v.trim().length >= 2 ? '' : 'Usa solo letras (mínimo 2).'); },
    correo: function (v) { return !v.trim() ? 'Ingresa tu correo electrónico.' : (G.RE_CORREO.test(v.trim()) ? '' : 'Escribe un correo válido, por ejemplo nombre@dominio.com.'); },
    asunto: function (v) { return !v.trim() ? 'Indica el asunto.' : (v.trim().length >= 3 ? '' : 'El asunto es demasiado corto.'); },
    mensaje: function (v) { return !v.trim() ? 'Escribe tu mensaje.' : (v.trim().length >= 10 ? '' : 'El mensaje debe tener al menos 10 caracteres.'); }
  };
  function validar(n) { return G.errorCampo(form.elements[n], reglas[n](form.elements[n].value)); }
  Object.keys(reglas).forEach(function (n) {
    form.elements[n].addEventListener('blur', function () { validar(n); });
    form.elements[n].addEventListener('input', function () { if (form.elements[n].getAttribute('aria-invalid')) validar(n); });
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var primero = null;
    Object.keys(reglas).forEach(function (n) { if (!validar(n) && !primero) primero = form.elements[n]; });
    estado.className = 'estado-formulario';
    if (primero) {
      primero.focus();
      estado.classList.add('error');
      estado.textContent = 'Revisa los campos marcados antes de enviar.';
      return;
    }
    estado.classList.add('info');
    estado.textContent = 'Los datos son válidos, pero esta versión del sitio no tiene un servicio de envío configurado, por lo que tu mensaje no se ha enviado. Escríbenos a contacto@glox3r.com.';
  });
})();

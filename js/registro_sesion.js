(function () {
  'use strict';
  var CLAVE_USUARIO = 'glox3r_usuario';
  var form = document.getElementById('form-registro');
  if (!form) return;
  var msg = document.getElementById('mensaje-formulario');
  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function mostrar(texto, tipo) {
    msg.textContent = texto;
    msg.className = 'mensaje-formulario ' + (tipo || '');
  }

  function aHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function hashClave(clave, sal) {
    var datos = new TextEncoder().encode(sal + ':' + clave);
    return window.crypto.subtle.digest('SHA-256', datos).then(aHex);
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var nombre = form.elements.nombre.value.trim();
    var apellido = form.elements.apellido.value.trim();
    var correo = form.elements.correo.value.trim().toLowerCase();
    var clave = form.elements.clave.value;
    var clave2 = form.elements.clave2.value;

    if (!nombre || !apellido) { mostrar('Completa tu nombre y apellido.', 'error'); return; }
    if (!RE_CORREO.test(correo)) { mostrar('Escribe un correo válido, por ejemplo nombre@dominio.com.', 'error'); form.elements.correo.focus(); return; }
    if (clave.length < 8) { mostrar('La clave debe tener al menos 8 caracteres.', 'error'); form.elements.clave.focus(); return; }
    if (clave !== clave2) { mostrar('Las claves no coinciden. Vuelve a intentarlo.', 'error'); form.elements.clave2.focus(); return; }
    if (!form.elements.terminos.checked) { mostrar('Debes aceptar los términos y condiciones.', 'error'); return; }
    if (!window.crypto || !window.crypto.subtle) { mostrar('Este navegador no permite crear la cuenta en este contexto. Abre el sitio desde https o localhost.', 'error'); return; }

    var sal = aHex(window.crypto.getRandomValues(new Uint8Array(16)));
    hashClave(clave, sal).then(function (hash) {
      try {
        window.localStorage.setItem(CLAVE_USUARIO, JSON.stringify({ nombre: nombre, apellido: apellido, correo: correo, sal: sal, hash: hash }));
      } catch (e) {
        mostrar('No se pudo guardar la cuenta: el navegador bloquea el almacenamiento local.', 'error');
        return;
      }
      mostrar('¡Registro exitoso! Redirigiendo para que inicies sesión…', 'ok');
      setTimeout(function () { window.location.href = 'Inicio_sesion.html'; }, 900);
    }).catch(function () { mostrar('No se pudo crear la cuenta. Inténtalo de nuevo.', 'error'); });
  });
})();

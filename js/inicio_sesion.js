(function () {
  'use strict';
  var CLAVE_USUARIO = 'glox3r_usuario';
  var CUENTA_PROFESOR = { correo: 'profesor@usmp.pe', clave: 'gloxer2026' };
  var form = document.getElementById('form-inicio');
  if (!form) return;
  var msg = document.getElementById('mensaje-formulario');
  function mostrar(texto, tipo) {
    msg.textContent = texto;
    msg.className = 'mensaje-formulario ' + (tipo || '');
  }

  function aHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function hashClave(clave, sal) {
    return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(sal + ':' + clave)).then(aHex);
  }
  function usuarioGuardado() {
    try { return JSON.parse(window.localStorage.getItem(CLAVE_USUARIO)); } catch (e) { return null; }
  }
  function entrar() {
    mostrar('¡Bienvenido de vuelta a GLOX3R!', 'ok');
    setTimeout(function () { window.location.href = 'catalogo_hombre.html'; }, 700);
  }
  function rechazar() {
    mostrar('Correo o contraseña incorrectos. Verifica tus datos o regístrate.', 'error');
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var correo = form.elements.correo.value.trim().toLowerCase();
    var clave = form.elements.clave.value;
    if (!correo || !clave) { mostrar('Ingresa tu correo y tu contraseña.', 'error'); return; }
    if (correo === CUENTA_PROFESOR.correo && clave === CUENTA_PROFESOR.clave) { entrar(); return; }

    var u = usuarioGuardado();
    if (!u || u.correo !== correo) { rechazar(); return; }
    if (!window.crypto || !window.crypto.subtle) { mostrar('Este navegador no permite verificar la cuenta en este contexto. Abre el sitio desde https o localhost.', 'error'); return; }
    hashClave(clave, u.sal).then(function (h) { if (h === u.hash) entrar(); else rechazar(); })
      .catch(function () { mostrar('No se pudo verificar la cuenta. Inténtalo de nuevo.', 'error'); });
  });
})();

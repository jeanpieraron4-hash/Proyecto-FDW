
/* GLOX3R - Finalizar compra y validar el formulario. */
(function () {
    'use strict';

    var G = window.GLOX3R;
    var form = document.getElementById('form-checkout');

    if (!G || !form) return;

    var CLAVE_PEDIDO = 'glox3r_pedido';
    var CLAVE_CONTADOR = 'glox3r_pedidos_contador';

    var MESES = [
        'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
        'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
    ];

    var btn = document.getElementById('btn-confirmar-pago');
    var aviso = document.getElementById('aviso-carrito-vacio');

    // Obtiene el método de envío seleccionado.
    function envioElegido() {
        var r = form.querySelector('input[name="envio"]:checked');

        return r && r.value === 'express'
            ? G.ENVIO_EXPRESS
            : G.ENVIO_ESTANDAR;
    }

    // Actualiza los productos y los precios del resumen.
    function dibujarResumen() {
        var ls = G.carrito.lineas();
        var cont = document.getElementById('mini-productos');

        cont.textContent = '';

        ls.forEach(function (l) {
            var subtotal = G.centimos(l.producto.precio) * l.cantidad;

            var texto = l.cantidad + 'x ' + l.producto.nombre +
                ' (' + l.talla + ') - ' + G.formatear(subtotal);

            cont.appendChild(G.el('p', '', texto));
        });

        var t = G.carrito.totales(
            ls.length ? envioElegido() : 0
        );

        document.getElementById('resumen-subtotal').textContent =
            G.formatear(t.subtotal);

        document.getElementById('resumen-envio').textContent =
            G.formatear(t.envio);

        document.getElementById('resumen-total').textContent =
            G.formatear(t.total);

        // Desactiva el botón si el carrito está vacío.
        var vacio = ls.length === 0;

        if (aviso) {
            aviso.hidden = !vacio;
        }

        if (btn) {
            btn.disabled = vacio;
        }

        return t;
    }

    // Obtiene solamente los números de un texto.
    function digitos(valor) {
        return String(valor).replace(/\D/g, '');
    }

    // Reglas para validar cada campo del formulario.
    var reglas = {
        correo: function (v) {
            if (!v.trim()) {
                return 'Ingresa tu correo electrónico.';
            }

            return G.RE_CORREO.test(v.trim())
                ? ''
                : 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
        },

        telefono: function (v) {
            if (!v.trim()) {
                return 'Ingresa tu teléfono o celular.';
            }

            var cantidad = digitos(v).length;

            return /^\+?[\d\s-]+$/.test(v.trim()) &&
                cantidad >= 7 && cantidad <= 15
                ? ''
                : 'Usa solo números (7 a 15 dígitos).';
        },

        nombres: function (v) {
            return G.RE_NOMBRE.test(v.trim()) && v.trim().length >= 2
                ? ''
                : 'Ingresa un nombre válido.';
        },

        apellidos: function (v) {
            return G.RE_NOMBRE.test(v.trim()) && v.trim().length >= 2
                ? ''
                : 'Ingresa apellidos válidos.';
        },

        direccion: function (v) {
            return v.trim().length >= 5
                ? ''
                : 'Ingresa una dirección válida.';
        },

        distrito: function (v) {
            return v.trim().length >= 2
                ? ''
                : 'Ingresa un distrito o ciudad válido.';
        },

        tarjeta: function (v) {
            if (!v.trim()) {
                return 'Ingresa el número de tarjeta.';
            }

            var cantidad = digitos(v).length;

            return /^[\d\s-]+$/.test(v) &&
                cantidad >= 13 && cantidad <= 19
                ? ''
                : 'El número de tarjeta debe tener entre 13 y 19 dígitos.';
        },

        vencimiento: function (v) {
            var m = /^(\d{2})\/(\d{2})$/.exec(v.trim());

            if (!v.trim()) {
                return 'Ingresa la fecha de vencimiento.';
            }

            if (!m || +m[1] < 1 || +m[1] > 12) {
                return 'Usa el formato MM/AA, por ejemplo 08/28.';
            }

            var hoy = new Date();
            var anio = 2000 + Number(m[2]);

            var vigente = anio > hoy.getFullYear() ||
                (anio === hoy.getFullYear() &&
                Number(m[1]) >= hoy.getMonth() + 1);

            return vigente ? '' : 'La tarjeta está vencida.';
        },

        cvv: function (v) {
            return /^\d{3,4}$/.test(v.trim())
                ? ''
                : 'El CVV tiene 3 o 4 dígitos.';
        },

        titular: function (v) {
            return G.RE_NOMBRE.test(v.trim()) && v.trim().length >= 2
                ? ''
                : 'Ingresa un nombre válido para la tarjeta.';
        }
    };

    // Comprueba un campo y muestra su mensaje de error si corresponde.
    function validarCampo(nombre) {
        var input = form.elements[nombre];

        return G.errorCampo(input, reglas[nombre](input.value));
    }

    // Valida los campos cuando el usuario sale de ellos o los corrige.
    Object.keys(reglas).forEach(function (nombre) {
        var input = form.elements[nombre];

        input.addEventListener('blur', function () {
            validarCampo(nombre);
        });

        input.addEventListener('input', function () {
            if (input.getAttribute('aria-invalid')) {
                validarCampo(nombre);
            }
        });
    });

    // Da formato automático a la fecha de vencimiento.
    form.elements.vencimiento.addEventListener('input', function (e) {
        var d = digitos(e.target.value).slice(0, 4);

        e.target.value = d.length > 2
            ? d.slice(0, 2) + '/' + d.slice(2)
            : d;
    });

    // Permite solamente números en el CVV.
    form.elements.cvv.addEventListener('input', function (e) {
        e.target.value = digitos(e.target.value).slice(0, 4);
    });

    // Actualiza el resumen cuando cambia el método de envío.
    Array.prototype.forEach.call(
        form.querySelectorAll('input[name="envio"]'),
        function (r) {
            r.addEventListener('change', dibujarResumen);
        }
    );

    // Actualiza el resumen si cambia el carrito.
    document.addEventListener('glox3r:carrito', dibujarResumen);

    // Procesa el formulario cuando se confirma el pedido.
    form.addEventListener('submit', function (ev) {
        ev.preventDefault();

        // Primero comprueba que haya productos.
        if (G.carrito.lineas().length === 0) {
            G.aviso('Tu carrito está vacío.');
            return;
        }

        // Valida todos los campos.
        var primero = null;

        Object.keys(reglas).forEach(function (nombre) {
            if (!validarCampo(nombre) && !primero) {
                primero = form.elements[nombre];
            }
        });

        // Lleva al usuario al primer campo incorrecto.
        if (primero) {
            primero.focus();
            G.aviso('Revisa los campos marcados.');
            return;
        }

        // Obtiene el total final.
        var t = dibujarResumen();

        // Genera el número del pedido.
        var n = (parseInt(G.leer(CLAVE_CONTADOR, 0), 10) || 0) + 1;

        var hoy = new Date();

        var pedido = {
            numero: 'GLX-' + String(n).padStart(5, '0'),
            fecha: hoy.getDate() + ' ' +
                MESES[hoy.getMonth()] + ' ' +
                hoy.getFullYear(),
            total: t.total
        };

        // Comprueba que se hayan guardado los datos del pedido.
        var contadorGuardado = G.guardar(CLAVE_CONTADOR, n);
        var pedidoGuardado = G.guardar(CLAVE_PEDIDO, pedido);

        if (!contadorGuardado || !pedidoGuardado) {
            G.aviso('No se pudo guardar el pedido. Inténtalo nuevamente.');
            return;
        }

        // Vacía el carrito y muestra la confirmación.
        G.carrito.vaciar();

        window.location.href = 'muestra_pago.html';
    });

    // Muestra el resumen al abrir la página.
    dibujarResumen();

})();
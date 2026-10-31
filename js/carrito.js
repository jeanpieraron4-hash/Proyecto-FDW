
(function () {
    'use strict';
    var G = window.GLOX3R;
    if (!G) return;
    var lista = document.getElementById('lista-carrito');
    var btnPagar = document.getElementById('btn-proceder-pago');
    if (!lista) return;

    function filaCarrito(l) {
        var p = l.producto;

        var caja = G.el('div', 'caja-producto');
        caja.setAttribute('data-id', p.id);

        var foto = G.el('div', 'foto-producto');
        foto.appendChild(G.crearImagen(p, ''));
        caja.appendChild(foto);

        var info = G.el('div', 'info-producto');
        info.appendChild(G.el('h2', '', p.nombre));
        var pTalla = G.el('p', 'talla');
        var idSel = 'talla-' + p.id;

        var etiqueta = G.el('label', '', 'Talla: ');
        etiqueta.setAttribute('for', idSel);
        pTalla.appendChild(etiqueta);

        var sel = G.el('select', 'select-talla');
        sel.id = idSel;
        sel.setAttribute('data-accion', 'talla');

        G.C.TALLAS[p.tipo].forEach(function (t) {
            var o = G.el('option', '', t);
            o.value = t;
            if (t === l.talla) o.selected = true;
            sel.appendChild(o);
        });

        sel.disabled = G.C.TALLAS[p.tipo].length === 1;
        pTalla.appendChild(sel);
        info.appendChild(pTalla);
        info.appendChild(
            G.el('p', 'precio', G.formatear(G.centimos(p.precio)) + ' c/u')
        );

        info.appendChild(
            G.el(
                'p',
                'subtotal-linea',
                'Subtotal: ' + G.formatear(
                    G.centimos(p.precio) * l.cantidad
                )
            )
        );

        caja.appendChild(info);

        var ctrl = G.el('div', 'controles-producto');
        var grupo = G.el('div', 'grupo-cantidad');

        var menos = G.el('button', 'btn-cantidad', '−');
        menos.type = 'button';
        menos.setAttribute('data-accion', 'menos');
        menos.setAttribute('aria-label', 'Disminuir cantidad de ' + p.nombre);
        menos.disabled = l.cantidad <= 1;

        var input = G.el('input', 'cantidad');
        input.type = 'number';
        input.min = '1';
        input.max = String(G.MAX_CANTIDAD);
        input.value = String(l.cantidad);
        input.inputMode = 'numeric';
        input.setAttribute('data-accion', 'cantidad');
        input.setAttribute('aria-label', 'Cantidad de ' + p.nombre);

        var mas = G.el('button', 'btn-cantidad', '+');
        mas.type = 'button';
        mas.setAttribute('data-accion', 'mas');
        mas.setAttribute('aria-label', 'Aumentar cantidad de ' + p.nombre);
        mas.disabled = l.cantidad >= G.MAX_CANTIDAD;

        grupo.appendChild(menos);
        grupo.appendChild(input);
        grupo.appendChild(mas);

        ctrl.appendChild(grupo);

        var del = G.el('button', 'btn-eliminar', 'Eliminar');
        del.type = 'button';
        del.setAttribute('data-accion', 'eliminar');
        del.setAttribute('aria-label', 'Eliminar ' + p.nombre + ' del carrito');

        ctrl.appendChild(del);
        caja.appendChild(ctrl);

        return caja;
    }

    function dibujar() {
        var ls = G.carrito.lineas();
        lista.textContent = '';
        if (!ls.length) {
            var vacio = G.el('div', 'carrito-vacio');
            vacio.appendChild(
                G.el('p', '', 'Tu carrito está vacío.')
            );

            var a = G.el('a', 'btn-seguir', 'Seguir comprando');
            a.href = '../index.html';
            vacio.appendChild(a);
            lista.appendChild(vacio);
        } else {
            ls.forEach(function (l) {
                lista.appendChild(filaCarrito(l));
            });
        }

        var t = G.carrito.totales();
        document.getElementById('resumen-subtotal').textContent =
            G.formatear(t.subtotal);
        document.getElementById('resumen-envio').textContent =
            G.formatear(t.envio);
        document.getElementById('resumen-total').textContent =
            G.formatear(t.total);

        if (btnPagar) {
            btnPagar.setAttribute(
                'aria-disabled',
                ls.length ? 'false' : 'true'
            );

            btnPagar.tabIndex = ls.length ? 0 : -1;
        }
    }

    function enfocarControl(id, accion) {
        var control = lista.querySelector(
            '[data-id="' + id + '"] [data-accion="' + accion + '"]'
        );

        if (control && !control.disabled) {
            control.focus();
        }
    }

    lista.addEventListener('click', function (ev) {
        var b = ev.target.closest('button[data-accion]');
        if (!b) return;

        var caja = b.closest('[data-id]');
        if (!caja) return;

        var id = caja.getAttribute('data-id');
        var accion = b.getAttribute('data-accion');

        var actual = G.carrito.lineas().filter(function (l) {
            return l.id === id;
        })[0];

        if (!actual) return;
        if (accion === 'mas') {
            G.carrito.cambiarCantidad(id, actual.cantidad + 1);
        } else if (accion === 'menos') {
            G.carrito.cambiarCantidad(id, actual.cantidad - 1);
        } else if (accion === 'eliminar') {
            G.carrito.eliminar(id);
            G.aviso(actual.producto.nombre + ' se eliminó del carrito');
        }
        if (accion !== 'eliminar') {
            enfocarControl(id, accion);
        }
    });

    lista.addEventListener('change', function (ev) {
        var campo = ev.target.closest('[data-accion]');
        if (!campo) return;

        var caja = campo.closest('[data-id]');
        if (!caja) return;

        var id = caja.getAttribute('data-id');
        var accion = campo.getAttribute('data-accion');

        if (accion === 'cantidad') {
            G.carrito.cambiarCantidad(id, campo.value);

        } else if (accion === 'talla') {
            G.carrito.cambiarTalla(id, campo.value);
        }

        enfocarControl(id, accion);
    });

    if (btnPagar) {
        btnPagar.addEventListener('click', function (ev) {
            if (btnPagar.getAttribute('aria-disabled') === 'true') {
                ev.preventDefault();
                G.aviso('Agrega al menos un producto para continuar.');
            }
        });
    }

    document.addEventListener('glox3r:carrito', dibujar);

    dibujar();

})();

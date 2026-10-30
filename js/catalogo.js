
(function (global) {
  'use strict';

  var TALLAS = {
    ropa: ['S', 'M', 'L', 'XL'],
    jean: ['28', '30', '32', '34', '36'],
    accesorio: ['Única']
  };
  var TALLA_DEFECTO = { ropa: 'M', jean: '32', accesorio: 'Única' };

  var ETIQUETAS = { hombre: 'Hombre', mujer: 'Mujer', accesorios: 'Accesorios' };

  var PRODUCTOS = [
    { id: 'blusa-crop-top',        nombre: 'Blusa Crop Top',        precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'blusa-oversize',        nombre: 'Blusa Oversize',        precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'blusa-slim-fit',        nombre: 'Blusa Slim Fit',        precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'jean-baggy-vintage',    nombre: 'Jean Baggy Vintage',    precio: 90, tipo: 'jean', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'blusa-wine-vibe',       nombre: 'Blusa Wine & Vibe',     precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'blusa-azul-grafica',    nombre: 'Blusa Azul Gráfica',    precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'blusa-marron-estampa',  nombre: 'Blusa Marrón Estampa',  precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'short-jean-baggy',      nombre: 'Short Jean Baggy',      precio: 70, tipo: 'jean', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'blusa-roja-basica',     nombre: 'Blusa Roja Básica',     precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'blusa-gris-urbana',     nombre: 'Blusa Gris Urbana',     precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },
    { id: 'blusa-negra-clasica',   nombre: 'Blusa Negra Clásica',   precio: 40, tipo: 'ropa', categorias: ['hombre', 'mujer'], catalogos: ['hombre', 'mujer'], imagen: null },

    { id: 'pulsera-aura-de-plata', nombre: 'Pulsera Aura de Plata', precio: 40, tipo: 'accesorio', categorias: ['accesorios', 'hombre', 'mujer'], catalogos: ['hombre', 'mujer'],
      imagen: 'https://i.pinimg.com/1200x/4a/86/54/4a86544299750baed52f745a440141fc.jpg' },

    { id: 'polo-boxy-fit-h',  nombre: 'Polo Boxy Fit', precio: 40, tipo: 'ropa', categorias: ['hombre'], catalogos: [],
      imagen: 'https://i.pinimg.com/1200x/e2/d2/ac/e2d2ac1544648db0045c3e34721ef26b.jpg' },
    { id: 'polo-oversize-h',  nombre: 'Polo Oversize', precio: 40, tipo: 'ropa', categorias: ['hombre'], catalogos: [],
      imagen: 'https://i.pinimg.com/736x/9f/25/9c/9f259c6b6128da507c828ba3b687a37b.jpg' },
    { id: 'polo-slim-fit-h',  nombre: 'Polo Slim Fit', precio: 40, tipo: 'ropa', categorias: ['hombre'], catalogos: [],
      imagen: 'https://i.pinimg.com/1200x/fa/d6/1e/fad61eca6c78ed5a342fb3c1875bb844.jpg' },
    { id: 'polo-slim-fit-m',  nombre: 'Polo Slim Fit', precio: 40, tipo: 'ropa', categorias: ['mujer'], catalogos: [],
      imagen: 'https://i.pinimg.com/1200x/62/66/42/6266428632f649c92b1e9656e872434a.jpg' },
    { id: 'polo-basico-m',    nombre: 'Polo básico',   precio: 40, tipo: 'ropa', categorias: ['mujer'], catalogos: [],
      imagen: 'https://i.pinimg.com/736x/cd/6d/37/cd6d3738e6cf592b5ea4b9ae67529632.jpg' },
    { id: 'polo-boxy-fit-m',  nombre: 'Polo Boxy Fit', precio: 40, tipo: 'ropa', categorias: ['mujer'], catalogos: [],
      imagen: 'https://i.pinimg.com/736x/f6/8c/14/f68c14f37a53098a566c81a66f61b393.jpg' },
    { id: 'collar-jscrst',    nombre: 'Collar JSCRST', precio: 40, tipo: 'accesorio', categorias: ['accesorios'], catalogos: [],
      imagen: 'https://i.pinimg.com/736x/2d/87/b1/2d87b15fff3b9a47523ad0361b34352c.jpg' },
    { id: 'collar-boho-rebel', nombre: 'Collar Boho Rebel', precio: 40, tipo: 'accesorio', categorias: ['accesorios'], catalogos: [],
      imagen: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80' },

    { id: 'tennis-club-tee', nombre: 'Tennis Club tee', precio: 40, tipo: 'accesorio', categorias: ['accesorios'], catalogos: [],
      imagen: 'https://i.pinimg.com/736x/ea/79/9e/ea799e01ddb73426fb2fd23b89b3a141.jpg' },
    { id: 'velvet-riot',     nombre: 'Velvet Riot',     precio: 40, tipo: 'accesorio', categorias: ['accesorios'], catalogos: [],
      imagen: 'https://i.pinimg.com/1200x/eb/a5/05/eba5053fd19c36e64a8a04ac3a3dde6b.jpg' },
    { id: 'midnight-bloom',  nombre: 'Midnight Bloom',  precio: 40, tipo: 'accesorio', categorias: ['accesorios'], catalogos: [],
      imagen: 'https://i.pinimg.com/1200x/56/41/38/564138c45141016f44eba30718ccf2fd.jpg' },
    { id: 'neon',            nombre: 'Neon',            precio: 40, tipo: 'accesorio', categorias: ['accesorios'], catalogos: [],
      imagen: 'https://i.pinimg.com/736x/71/a4/1f/71a41f9ece0428196833a200423f508e.jpg' }
  ];

  global.GLOX3R_CATALOGO = {
    PRODUCTOS: PRODUCTOS,
    TALLAS: TALLAS,
    TALLA_DEFECTO: TALLA_DEFECTO,
    ETIQUETAS: ETIQUETAS
  };
})(window);

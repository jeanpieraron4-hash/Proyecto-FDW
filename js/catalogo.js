(function (global) {
  'use strict';

  var TALLAS = {
    ropa: ['S', 'M', 'L', 'XL'],
    jean: ['28', '30', '32', '34', '36'],
    accesorio: ['Única']
  };

  var TALLA_DEFECTO = {
    ropa: 'M',
    jean: '32',
    accesorio: 'Única'
  };

  var ETIQUETAS = {
    hombre: 'Hombre',
    mujer: 'Mujer',
    accesorios: 'Accesorios'
  };

  var PRODUCTOS = [
    {
      id: 'polo-boxy-fit-h',
      nombre: 'Polo Boxy Fit',
      precio: 45,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Boxy Fit.jpeg'
    },
    {
      id: 'polo-oversize-h',
      nombre: 'Polo Oversize',
      precio: 43,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Overzise.jpg'
    },
    {
      id: 'polo-slim-fit-h',
      nombre: 'Polo Slim Fit',
      precio: 45,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Slim Fit.jpg'
    },
    {
      id: 'jean-baggy-h',
      nombre: 'Jean Baggy',
      precio: 85,
      tipo: 'jean',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Jean Baggy.jpg'
    },
    {
      id: 'polo-wine-&-vibe-h',
      nombre: 'Polo Wine & Vibe',
      precio: 55,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Wine & Vibe.jpeg'
    },
    {
      id: 'polo-azul-grafico-h',
      nombre: 'Polo Azul Gráfico',
      precio: 48,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Azul Grafico.jpeg'
    },
    {
      id: 'polo-marron-estampado-h',
      nombre: 'Polo Marrón Estampado',
      precio: 55,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Marron Estampado.jpeg'
    },
    {
      id: 'short-jean-baggy-h',
      nombre: 'Short Jean Baggy',
      precio: 75,
      tipo: 'jean',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Short Jean Baggy.jpeg'
    },
    {
      id: 'polo-rojo-basico-h',
      nombre: 'Polo Rojo Básico',
      precio: 35,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Rojo Básico.jpeg'
    },
    {
      id: 'polo-gris-urbano-h',
      nombre: 'Polo Gris Urbano',
      precio: 45,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Gris Urbano.jpeg'
    },
    {
      id: 'polo-negro-clasico-h',
      nombre: 'Polo Negro Clásico',
      precio: 39.99,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Polo Negro Clasico.jpeg'
    },
    {
      id: 'pantalon-jogger-h',
      nombre: 'Pantalon Jogger',
      precio: 60,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: '../img/Pantalon Jogger.jpeg'
    },

    {
      id: 'polo-boxy-fit-m',
      nombre: 'Polo Boxy fit',
      precio: 42,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Boxy Fit Mujer.jpeg'
    },
    {
      id: 'polo-overzise-m',
      nombre: 'Polo Oversize',
      precio: 43,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Oversize Mujer.png'
    },
    {
      id: 'polo-slim-fit-m',
      nombre: 'Polo Slim Fit',
      precio: 49,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Slim Fit Mujer.jpeg'
    },
    {
      id: 'jean-baggy-vintage-m',
      nombre: 'Jean Baggy Vintage',
      precio: 85,
      tipo: 'jean',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Jean Baggy Vintage.jpg'
    },
    {
      id: 'polo-wine-&-vibe-m',
      nombre: 'Polo Wine & Vibe',
      precio: 59,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Wine & Vibe Mujer.png'
    },
    {
      id: 'polo-azul-grafico',
      nombre: 'Polo Azul Gráfico',
      precio: 50,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Azul Grafico Mujer.jpeg'
    },
    {
      id: 'polo-marron-estampado-m',
      nombre: 'Polo Marrón Estampado',
      precio: 55,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Marron Estampado Mujer.jpeg'
    },
    {
      id: 'short-jean-baggy-m',
      nombre: 'Short Jean Baggy',
      precio: 75,
      tipo: 'jean',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Short Jean Baggy Mujer.jpg'
    },
    {
      id: 'polo-rojo-basico-m',
      nombre: 'Polo Rojo Básico',
      precio: 42,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Rojo Basico Mujer.jpeg'
    },
    {
      id: 'polo-gris-urbano-m',
      nombre: 'Polo Gris Urbano',
      precio: 49,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Gris Urbano Mujer.jpeg'
    },
    {
      id: 'polo-negro-slim-m',
      nombre: 'Polo Negro Slim',
      precio: 49,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Negro Slim Mujer.png'
    },
    {
      id: 'polo-basico-m',
      nombre: 'Polo Básico',
      precio: 42,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: '../img/Polo Basico Mujer.jpeg'
    },

    {
      id: 'pulsera-aura-de-plata',
      nombre: 'Pulsera Aura de Plata',
      precio: 75,
      tipo: 'accesorio',
      categorias: ['accesorios'],
      catalogos: [],
      imagen: '../img/Pulsera Aura de Plata.jpg'
    },
    {
      id: 'collar-velvet-riot',
      nombre: 'Collar Velvet Riot',
      precio: 90,
      tipo: 'accesorio',
      categorias: ['accesorios'],
      catalogos: [],
      imagen: '../img/Collar Velvet Riot.png'
    },
    {
      id: 'collar-jscrst',
      nombre: 'Collar JSCRST',
      precio: 89,
      tipo: 'accesorio',
      categorias: ['accesorios'],
      catalogos: [],
      imagen: '../img/Collar JSCRST.jpg'
    },
    {
      id: 'anillo-roman',
      nombre: 'Anillo Roman',
      precio: 49,
      tipo: 'accesorio',
      categorias: ['accesorios'],
      catalogos: [],
      imagen: '../img/Anillo Roman.webp'
    }
  ];

  global.GLOX3R_CATALOGO = {
    PRODUCTOS: PRODUCTOS,
    TALLAS: TALLAS,
    TALLA_DEFECTO: TALLA_DEFECTO,
    ETIQUETAS: ETIQUETAS
  };

})(window);
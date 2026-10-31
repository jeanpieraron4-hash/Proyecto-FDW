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
      imagen: null
    },
    {
      id: 'polo-oversize-h',
      nombre: 'Polo Oversize',
      precio: 43,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-slim-fit-h',
      nombre: 'Polo Slim Fit',
      precio: 45,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'jean-baggy-h',
      nombre: 'Jean Baggy',
      precio: 85,
      tipo: 'jean',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-wine-&-vibe-h',
      nombre: 'Polo Wine & Vibe',
      precio: 55,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-azul-grafico-h',
      nombre: 'Polo Azul Gráfico',
      precio: 48,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-marron-estampado-h',
      nombre: 'Polo Marrón Estampado',
      precio: 55,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'short-jean-baggy-h',
      nombre: 'Short Jean Baggy',
      precio: 75,
      tipo: 'jean',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-rojo-basico-h',
      nombre: 'Polo Rojo Básico',
      precio: 35,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-gris-urbano-h',
      nombre: 'Polo Gris Urbano',
      precio: 45,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-negro-clasico-h',
      nombre: 'Polo Negro Clásico',
      precio: 39.99,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'pantalon-jogger-h',
      nombre: 'Pantalon Jogger',
      precio: 60,
      tipo: 'ropa',
      categorias: ['hombre'],
      catalogos: [],
      imagen: null
    },

    {
      id: 'polo-boxy-fit-m',
      nombre: 'Polo Boxy fit',
      precio: 42,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-overzise-m',
      nombre: 'Polo Oversize',
      precio: 43,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-slim-fit-m',
      nombre: 'Polo Slim Fit',
      precio: 49,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'jean-baggy-vintage-m',
      nombre: 'Jean Baggy Vintage',
      precio: 85,
      tipo: 'jean',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'blusa-wine-&-vibe-m',
      nombre: 'Blusa Wine & Vibe',
      precio: 59,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'blusa-azul-grafica',
      nombre: 'Blusa Azul Gráfica',
      precio: 50,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'blusa-marron-estampada-m',
      nombre: 'Blusa Marrón Estampada',
      precio: 55,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'short-jean-baggy-m',
      nombre: 'Short Jean Baggy',
      precio: 75,
      tipo: 'jean',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'blusa-roja-basica-m',
      nombre: 'Blusa Roja Básica',
      precio: 42,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'blusa-gris-urbana-m',
      nombre: 'Blusa Gris Urbana',
      precio: 49,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'blusa-negra-clasica-m',
      nombre: 'Blusa Negra Clásica',
      precio: 49,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'polo-basico-m',
      nombre: 'Polo Básico',
      precio: 42,
      tipo: 'ropa',
      categorias: ['mujer'],
      catalogos: [],
      imagen: null
    },

    {
      id: 'pulsera-aura-de-plata',
      nombre: 'Pulsera Aura de Plata',
      precio: 75,
      tipo: 'accesorio',
      categorias: ['accesorios'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'collar-velvet-riot',
      nombre: 'Collar Velvet Riot',
      precio: 90,
      tipo: 'accesorio',
      categorias: ['accesorios'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'collar-jscrst',
      nombre: 'Collar JSCRST',
      precio: 89,
      tipo: 'accesorio',
      categorias: ['accesorios'],
      catalogos: [],
      imagen: null
    },
    {
      id: 'anillo-roman',
      nombre: 'Anillo Roman',
      precio: 49,
      tipo: 'accesorio',
      categorias: ['accesorios'],
      catalogos: [],
      imagen: null
    }
  ];

  global.GLOX3R_CATALOGO = {
    PRODUCTOS: PRODUCTOS,
    TALLAS: TALLAS,
    TALLA_DEFECTO: TALLA_DEFECTO,
    ETIQUETAS: ETIQUETAS
  };

})(window);
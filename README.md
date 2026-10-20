# Banco App 🏦

## Descripción

Banco App es un proyecto que estoy desarrollando mientras aprendo JavaScript. La idea es simular algunas operaciones básicas de un banco, como crear cuentas, depositar, retirar dinero y revisar los movimientos.

Al principio, el programa funcionaba con `prompt()` y `alert()`. Después lo fui mejorando para que tuviera una interfaz con HTML y CSS, y para manejar las operaciones desde botones y formularios.

## Funciones del proyecto

- Registrar un usuario con nombre, correo y edad.
- Crear automáticamente una cuenta Normal al registrarse.
- Agregar cuentas de Ahorro y Corriente.
- Consultar los saldos de las cuentas.
- Depositar y retirar dinero, con validaciones de montos y saldo disponible.
- Ver el historial de una cuenta o el historial general.
- Mostrar los movimientos más recientes primero y actualizar el historial cuando se realizan operaciones.
- Eliminar cuentas. Al eliminar la cuenta Normal, también se elimina el usuario.
- Guardar los datos en `localStorage` para que se mantengan al actualizar la página.

## Tecnologías utilizadas

- **HTML:** para crear los formularios y la estructura de la página.
- **CSS:** para darle estilo a la aplicación y ordenar los formularios y tarjetas.
- **JavaScript:** para programar las operaciones, validar los datos y actualizar la página.

## Temas de JavaScript que practiqué

En este proyecto he puesto en práctica varios contenidos del curso:

- Variables, funciones, condiciones y clases.
- Objetos y arrays.
- Métodos como `push()`, `splice()`, `find()`, `findIndex()`, `some()`, `map()` y `forEach()`.
- Manipulación del DOM con `querySelector()`, `innerHTML` y `textContent`.
- Eventos con `addEventListener()`.
- `localStorage`, `JSON.stringify()` y `JSON.parse()`.
- Operadores ternarios, `??`, `?.` y desestructuración de objetos.

## Cómo ejecutar Banco App

1. Descargar o abrir la carpeta del proyecto en Visual Studio Code.
2. Abrir el archivo `index.html` en un navegador. También se puede usar la extensión Live Server de VS Code.
3. Registrarse con los datos solicitados y probar las operaciones bancarias.

Los datos de prueba se guardan en el `localStorage` del navegador, por lo que al actualizar la página se pueden recuperar las cuentas y los movimientos. Para borrar esos datos se puede utilizar la opción de eliminar la cuenta Normal desde la aplicación.

## Estructura del proyecto

```text
BancoApp/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── main.js
```

## Lo que aprendí

Este proyecto me ha servido para entender mejor cómo trabajar con objetos y arrays, conectar JavaScript con elementos de HTML y actualizar la información en pantalla sin recargar la página.

Uno de los temas más nuevos para mí fue `localStorage`, porque antes los datos se perdían al actualizar la página. Ahora puedo guardarlos y recuperarlos, y también comprendí que hay que volver a preparar los objetos de una clase después de leerlos desde JSON.

Todavía estoy aprendiendo JavaScript, así que mi objetivo con Banco App es seguir practicando y mejorar el código a medida que avance en el curso.

## Importante

Banco App es solamente un **simulador realizado con fines de aprendizaje**. No se conecta a un banco real ni maneja dinero verdadero.

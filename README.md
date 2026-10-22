# Banco App 🏦

**Versión actual: v0.5**

## Descripción

Banco App es un proyecto que estoy desarrollando mientras aprendo JavaScript. Su objetivo es simular algunas operaciones básicas de un banco, como crear cuentas, depositar y retirar dinero, consultar saldos y revisar el historial de movimientos.

El proyecto comenzó funcionando mediante `prompt()` y `alert()`. A medida que fui avanzando en el curso, incorporé una interfaz con HTML y CSS, eventos, almacenamiento local, funciones asíncronas y librerías de JavaScript.

Mi intención es seguir mejorándolo con los conocimientos que voy aprendiendo en cada módulo.

## Funcionalidades actuales

### Usuarios y cuentas bancarias

- Registrar un usuario con nombre, correo electrónico y edad.
- Crear automáticamente una cuenta Normal al registrarse.
- Abrir cuentas adicionales de Ahorro y Corriente.
- Consultar los saldos disponibles.
- Eliminar cuentas mediante ventanas de confirmación con SweetAlert2.
- Eliminar el usuario y sus cuentas al eliminar la cuenta Normal.

### Operaciones bancarias

- Depositar dinero en una cuenta seleccionada.
- Retirar dinero verificando el saldo disponible.
- Validar los montos ingresados y las cuentas seleccionadas.
- Actualizar los saldos después de cada operación.
- Registrar depósitos y retiros con su monto y fecha.

### Historial de movimientos

- Consultar el historial general o el de una cuenta específica.
- Mostrar automáticamente los movimientos al seleccionar una cuenta.
- Ordenar los movimientos del más reciente al más antiguo.
- Buscar movimientos en tiempo real por tipo, cuenta o monto.
- Actualizar el historial después de realizar depósitos y retiros.
- Mostrar mensajes cuando no existen movimientos o no se encuentran coincidencias.

### Almacenamiento y manejo de errores

- Guardar usuarios, cuentas y movimientos mediante `localStorage`.
- Recuperar la información al actualizar la página.
- Utilizar `try`, `catch` y `finally` para controlar errores.
- Detectar ciertos problemas en los datos guardados.
- Crear un respaldo de la información defectuosa antes de permitir un nuevo registro, cuando sea posible.

### Notificaciones y consejos bancarios

- Mostrar un aviso bancario unos segundos después de ingresar, mediante `setTimeout()` y Toastify.
- Utilizar SweetAlert2 para confirmar la eliminación de cuentas.
- Cargar consejos de seguridad bancaria desde un archivo JSON utilizando `fetch()`.
- Mostrar los consejos en grupos de tres.
- Cambiar de grupo mediante un botón, sin solicitar nuevamente los datos.
- Informar dentro de la sección cuando los consejos no pueden cargarse.

## Tecnologías y librerías utilizadas

- **HTML5:** estructura de la página, formularios y elementos de la interfaz.
- **CSS3:** diseño, colores, tarjetas y distribución adaptable.
- **JavaScript:** operaciones bancarias, validaciones, eventos y manipulación del DOM.
- **localStorage:** almacenamiento de usuarios, cuentas y movimientos en el navegador.
- **JSON:** organización e intercambio de datos.
- **Fetch API:** lectura de información desde un archivo JSON local.
- **SweetAlert2:** ventanas de confirmación para operaciones importantes.
- **Toastify:** notificaciones temporales.

Las librerías SweetAlert2 y Toastify se incorporaron mediante CDN.

## Cómo ejecutar Banco App

1. Descargar o clonar el repositorio del proyecto.
2. Abrir la carpeta `BancoApp` en Visual Studio Code.
3. Instalar la extensión **Live Server**, si todavía no está instalada.
4. Abrir `index.html` utilizando la opción **Open with Live Server**.
5. Registrarse y comenzar a utilizar las funciones del simulador.

Es importante ejecutar la aplicación mediante un servidor local, ya que el proyecto utiliza `fetch()` para consultar el archivo `data/consejos.json`.

Los usuarios y sus movimientos se almacenan mediante `localStorage`, por lo que la información se mantiene al actualizar la página mientras no se elimine el almacenamiento correspondiente.

## Estructura del proyecto

```text
BancoApp/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
└── data/
    └── consejos.json
```

**Descripción de los archivos:**

- `index.html`: contiene la estructura de la aplicación.
- `css/style.css`: contiene los estilos y el diseño.
- `js/main.js`: contiene la lógica bancaria y las funciones de JavaScript.
- `data/consejos.json`: contiene los consejos de seguridad bancaria.
- `README.md`: documenta el proyecto y sus actualizaciones.

## Historial de versiones

Las siguientes versiones representan las principales etapas de desarrollo del proyecto. Son etiquetas descriptivas; no necesariamente corresponden a versiones publicadas como etiquetas de Git.

### v0.5 — APIs, librerías y mejoras de interfaz

**Pre-Entrega 10 y correcciones de la Pre-Entrega 7**

- Incorporé SweetAlert2 para reemplazar las confirmaciones nativas de eliminación.
- Incorporé Toastify para mostrar el aviso bancario.
- Agregué un buscador de movimientos utilizando el evento `input`.
- Eliminé el botón «Ver historial» para que los movimientos aparezcan automáticamente.
- Implementé `fetch()` y `async/await` para cargar información desde un archivo JSON.
- Agregué una sección de consejos bancarios que muestra tres consejos a la vez.
- Incorporé un botón para consultar otros grupos de consejos.
- Mejoré la presentación de errores durante la carga de información.
- Eliminé mensajes de depuración innecesarios de la consola.

### v0.4 — Asincronismo y manejo de errores

**Pre-Entrega 9**

- Incorporé `setTimeout()` para mostrar información después de ingresar al simulador.
- Practiqué las funciones callback.
- Implementé `try`, `catch` y `finally` para controlar errores.
- Agregué un mecanismo de respaldo para ciertos casos de información defectuosa en `localStorage`.
- Realicé ejercicios de promesas utilizando `new Promise()`, `resolve()`, `reject()`, `.then()`, `.catch()` y `async/await`.

La simulación de autorización con promesas fue un ejercicio de aprendizaje y no corresponde a una autorización bancaria real.

### v0.3 — Persistencia de datos

**Pre-Entrega 8**

- Incorporé `localStorage` para conservar los usuarios y sus cuentas.
- Implementé `JSON.stringify()` y `JSON.parse()`.
- Agregué la recuperación de datos al recargar la página.
- Aprendí a reconstruir las instancias de la clase y las fechas del historial después de recuperar información almacenada.

### v0.2 — Interfaz y operaciones bancarias

- Reemplacé las interacciones mediante `prompt()` y `alert()` por formularios y botones.
- Diseñé la interfaz utilizando HTML y CSS.
- Incorporé la visualización de cuentas, saldos y movimientos.
- Agregué las operaciones de depósito, retiro y eliminación de cuentas.
- Utilicé eventos y manipulación del DOM para actualizar la información sin recargar la página.

### v0.1 — Primer simulador bancario

- Desarrollé las primeras funciones de la aplicación.
- Practiqué clases, objetos, arrays y métodos de JavaScript.
- Utilicé `prompt()` y `alert()` para interactuar con el usuario.
- Implementé las primeras operaciones bancarias simuladas.

## Temas de JavaScript que practiqué

Durante el desarrollo de Banco App he trabajado con:

- Variables, funciones, condiciones y clases.
- Objetos, arrays y métodos como `push()`, `splice()`, `find()`, `findIndex()`, `some()`, `map()`, `filter()`, `forEach()`, `slice()` y `reverse()`.
- Manipulación del DOM mediante `querySelector()`, `createElement()`, `innerHTML` y `textContent`.
- Eventos como `click`, `submit`, `change` e `input`.
- Almacenamiento local con `localStorage`.
- Conversión de datos mediante JSON.
- Operadores ternarios, `??`, `?.` y desestructuración.
- Temporizadores, callbacks y nociones del Event Loop.
- Promesas y funciones asíncronas.
- `async`, `await`, `.then()` y `.catch()`.
- Manejo de errores con `try`, `catch`, `finally` y `throw`.
- Peticiones con `fetch()` y lectura de respuestas JSON.
- Incorporación y uso de librerías externas.

## Lo que aprendí

Banco App me ha permitido aplicar los contenidos del curso en un mismo proyecto y entender mejor cómo se relacionan entre sí.

Al principio trabajaba principalmente con funciones, objetos y arrays, pero después aprendí a conectar JavaScript con HTML para crear una interfaz en la que el usuario pudiera realizar operaciones mediante formularios.

Otro aprendizaje importante fue `localStorage`. Antes, los datos se perdían al actualizar la página. Ahora puedo guardarlos y recuperarlos, incluyendo las cuentas y los movimientos realizados.

También pude comprender mejor el asincronismo. Al comienzo me costó entender las promesas, pero mediante ejercicios prácticos aprendí a diferenciar los temporizadores, las funciones asíncronas y el manejo de errores.

En las últimas actualizaciones incorporé `fetch()` para obtener datos desde un archivo JSON y aprendí a utilizar SweetAlert2 y Toastify para mejorar la interacción con el usuario.

Quiero seguir desarrollando Banco App a medida que avance en el curso, incorporando nuevas funcionalidades y mejorando la organización del código.

## Próximas mejoras

Una de las siguientes funcionalidades que quiero incorporar es un sistema de **transferencias bancarias simuladas**, que permita:

- Seleccionar una cuenta de origen.
- Ingresar el nombre de un destinatario y el monto.
- Revisar y confirmar la información mediante SweetAlert2.
- Descontar el monto de la cuenta seleccionada.
- Registrar la transferencia en el historial.
- Buscar transferencias por el nombre del destinatario.

Esta funcionalidad todavía no está implementada.

## Importante

**Banco App es un simulador desarrollado únicamente con fines educativos.**

No se conecta a un banco real, no realiza transferencias verdaderas y no maneja dinero real.

La información se guarda localmente en el navegador y no cuenta con un sistema de autenticación bancaria ni con un servidor que proteja los datos como lo haría una aplicación financiera real.

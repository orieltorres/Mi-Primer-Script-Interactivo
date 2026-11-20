# Banco App 🏦

**Proyecto final — Curso de JavaScript ES6+**  
**Estado:** versión preparada para revisión y entrega final.

## Descripción

Banco App es un simulador bancario educativo que desarrollé para aplicar los conocimientos adquiridos durante mi curso de JavaScript ES6+. Permite administrar cuentas ficticias, realizar depósitos y retiros, consultar saldos y revisar los movimientos registrados.

El proyecto comenzó como una aplicación sencilla que utilizaba `prompt()` y `alert()`. A medida que avancé en el curso, lo transformé en una aplicación web interactiva con HTML, CSS, JavaScript, módulos ES6, persistencia de datos, archivos JSON, peticiones asíncronas y librerías externas.

**No es una aplicación bancaria real:** no utiliza dinero verdadero, no se conecta a entidades financieras y no requiere registro ni inicio de sesión.

## Funcionalidades actuales

### Usuarios y cuentas bancarias

- Iniciar el simulador con un usuario ficticio creado automáticamente cuando no existen datos guardados.
- Crear una cuenta principal **Normal** con saldo inicial de $0.
- Abrir cuentas adicionales de **Ahorro** y **Corriente**, evitando duplicar un tipo de cuenta ya existente.
- Consultar el identificador y el saldo de cada cuenta.
- Eliminar únicamente las cuentas adicionales, con confirmación mediante **SweetAlert2**.
- Mantener protegida la cuenta Normal frente a la eliminación individual.
- Reiniciar el simulador, previa confirmación, para volver al usuario ficticio y a la cuenta Normal iniciales.

### Operaciones bancarias

- Depositar dinero en una cuenta seleccionada.
- Retirar dinero cuando la cuenta tiene saldo suficiente.
- Validar la cuenta seleccionada y el monto ingresado.
- Agregar un **detalle opcional** de hasta 100 caracteres a los depósitos y retiros.
- Actualizar los saldos y registrar los movimientos con su tipo, monto, detalle y fecha.
- Informar si una operación no puede completarse o guardarse.
- Utilizar un mecanismo de respaldo en memoria para restaurar cuentas e historiales ante determinados errores de guardado.

### Historial de movimientos

- Consultar el **historial general** o el de una cuenta específica.
- Mostrar los movimientos del más reciente al más antiguo.
- Filtrar por tipo: **Todos**, **Depósitos** o **Retiros**.
- Filtrar por **monto mínimo y máximo**.
- Buscar movimientos mediante un campo de búsqueda que se actualiza mientras escribo, incluyendo el detalle opcional.
- Combinar filtros y mostrar mensajes cuando no hay movimientos o coincidencias.
- Consultar muchos movimientos mediante desplazamiento dentro del panel del historial, sin alargar innecesariamente la página.

### Almacenamiento y manejo de errores

- Guardar y recuperar usuarios, cuentas, saldos e historiales usando `localStorage`.
- Conservar la información al recargar la página.
- Validar parte de la estructura de los datos recuperados.
- Intentar crear un respaldo de datos guardados incorrectamente antes de sustituirlos, cuando es posible.
- Manejar errores de operaciones y de carga de archivos, mostrando mensajes en la interfaz.
- Reiniciar los datos de prueba utilizando la clave correspondiente de `localStorage`, sin borrar indiscriminadamente otras claves del navegador.

### Notificaciones y consejos bancarios

- Mostrar un recordatorio bancario temporal mediante **Toastify** y `setTimeout()`.
- Usar **SweetAlert2** para confirmar acciones como la eliminación de cuentas y el reinicio.
- Cargar consejos de seguridad desde `data/consejos.json` mediante `fetch()` y `async/await`.
- Mostrar los consejos en grupos de tres y avanzar entre los grupos sin volver a descargar el archivo.
- Mostrar un mensaje cuando no se pueden cargar los consejos.

## Tecnologías utilizadas

- **HTML5:** estructura, formularios y elementos de interfaz.
- **CSS3:** apariencia personalizada, tarjetas, Flexbox y CSS Grid.
- **JavaScript ES6+:** clases, métodos, módulos, funciones, eventos y manipulación del DOM.
- **JSON y Fetch API:** carga de tipos de cuenta y consejos desde archivos locales.
- **`async` / `await`, `try` / `catch` / `finally`:** programación asíncrona y manejo de errores.
- **`localStorage`:** persistencia de datos de prueba en el navegador.
- **SweetAlert2:** cuadros de confirmación personalizados.
- **Toastify:** avisos temporales.

Las librerías externas se cargan mediante CDN. Se necesita conexión a Internet para obtenerlas si el navegador no las tiene en caché.

## Cómo ejecutar Banco App

1. Descarga o clona el repositorio.
2. Abre la carpeta del proyecto en **Visual Studio Code**.
3. Instala la extensión **Live Server** si todavía no la tienes.
4. Haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.
5. Utiliza el simulador. Si no existen datos previos, se creará automáticamente un usuario de prueba con una cuenta Normal.

**Importante:** ejecuta el proyecto mediante un servidor local, no abriendo `index.html` directamente con `file://`, porque la aplicación utiliza `fetch()` para leer archivos JSON locales.

Los datos de las cuentas y los movimientos se almacenan en el navegador mediante `localStorage`. Si cambias de navegador, origen o almacenamiento, los datos de prueba pueden no estar disponibles. El botón **Reiniciar simulador** restablece los datos bancarios de prueba tras solicitar confirmación.

## Estructura del proyecto

```text
BancoApp/
├── index.html
├── README.md
├── assets/
│   └── favicon.svg
├── css/
│   └── style.css
├── data/
│   ├── cuentas.json
│   └── consejos.json
└── js/
    ├── banco.js
    ├── datos.js
    └── main.js
```

**Descripción de los archivos:**

- `index.html`: estructura de la página, formularios y enlaces a los recursos.
- `assets/favicon.svg`: ícono de la pestaña del navegador.
- `css/style.css`: estilos y distribución visual del simulador.
- `data/cuentas.json`: tipos de cuentas adicionales disponibles (Ahorro y Corriente).
- `data/consejos.json`: catálogo de consejos de seguridad bancaria.
- `js/banco.js`: clase `NuevoUsuario` y métodos de consulta, depósito y retiro.
- `js/datos.js`: lectura de JSON, almacenamiento, recuperación y validación de datos.
- `js/main.js`: coordinación de la aplicación, interacción con el DOM, eventos, filtros, cuentas y reinicio.
- `README.md`: documentación del proyecto y de su evolución.

> En el proyecto local también puede existir `.vscode/settings.json`, que contiene preferencias de Visual Studio Code y no forma parte de la lógica bancaria.

## Historial de desarrollo

Las siguientes versiones describen las principales etapas de aprendizaje. No necesariamente representan etiquetas publicadas en Git.

### Etapa de preparación de la entrega final

- Eliminé el registro y el inicio de sesión para utilizar automáticamente un usuario ficticio.
- Protegí la cuenta Normal frente a la eliminación individual.
- Incorporé detalles opcionales en depósitos y retiros.
- Agregué filtros por tipo de movimiento, monto mínimo y máximo, y búsqueda por detalle.
- Organicé funciones reutilizables para generar y actualizar los selectores de cuentas.
- Añadí un mecanismo de protección frente a ciertos errores de guardado.
- Incorporé el reinicio del simulador y el restablecimiento de los filtros.
- Rediseñé la interfaz para aprovechar mejor el espacio, con operaciones e historial en columnas y scroll interno para los movimientos.
- Añadí un favicon y una carpeta `assets/`.

### v0.5 — APIs, librerías y mejoras de interfaz

**Pre-Entrega 10 y correcciones de la Pre-Entrega 7**

- Incorporé SweetAlert2 para reemplazar las confirmaciones nativas.
- Incorporé Toastify para mostrar un aviso bancario.
- Agregué un buscador de movimientos mediante el evento `input`.
- Eliminé el botón «Ver historial» para actualizar los movimientos automáticamente.
- Implementé `fetch()` y `async/await` para cargar información desde JSON.
- Agregué consejos bancarios en grupos de tres y un botón para consultar otros grupos.
- Mejoré los mensajes de error durante la carga de datos.

### v0.4 — Asincronismo y manejo de errores

**Pre-Entrega 9**

- Practiqué `setTimeout()`, callbacks y manejo de errores mediante `try`, `catch` y `finally`.
- Incorporé un mecanismo de respaldo para ciertos datos incorrectos en `localStorage`.
- Realicé ejercicios con promesas, `resolve()`, `reject()`, `.then()`, `.catch()` y `async/await`.

La simulación de autorización con promesas fue un ejercicio de aprendizaje; no es una autorización bancaria real ni una funcionalidad de la versión actual.

### v0.3 — Persistencia de datos

**Pre-Entrega 8**

- Incorporé `localStorage`, `JSON.stringify()` y `JSON.parse()`.
- Implementé la recuperación de cuentas y movimientos al recargar la página.
- Aprendí a reconstruir instancias y fechas del historial a partir de datos guardados.

### v0.2 — Interfaz y operaciones bancarias

- Reemplacé las interacciones mediante `prompt()` y `alert()` por formularios y botones.
- Incorporé HTML, CSS, eventos y manipulación del DOM.
- Agregué la visualización de cuentas, saldos y movimientos, junto con depósitos y retiros.

### v0.1 — Primer simulador bancario

- Practiqué funciones, clases, objetos, arrays y métodos de JavaScript.
- Utilicé inicialmente `prompt()` y `alert()` en las primeras versiones.
- Implementé las primeras operaciones bancarias simuladas.

## Temas de JavaScript que practiqué

Durante el desarrollo de Banco App trabajé con:

- Variables, funciones, condiciones, objetos, clases y métodos.
- Arrays y métodos como `push()`, `splice()`, `find()`, `findIndex()`, `some()`, `map()`, `filter()`, `forEach()`, `slice()` y `reverse()`.
- Manipulación del DOM con `querySelector()`, `createElement()`, `appendChild()`, `textContent` e `innerHTML`.
- Eventos `click`, `submit`, `change` e `input`.
- Funciones reutilizables, parámetros, argumentos y callbacks.
- Operadores ternarios, `||`, `??`, encadenamiento opcional (`?.`) y destructuring.
- Módulos ES6 mediante `import` y `export`.
- Almacenamiento local, JSON y validación de datos.
- Temporizadores, promesas, asincronismo y manejo de errores.
- `fetch()`, `async` / `await`, `try` / `catch` / `finally` y `throw`.
- Integración de librerías externas.

## Lo que aprendí

Banco App me permitió aplicar los contenidos del curso en un mismo proyecto y comprender mejor cómo se relacionan entre sí.

Al principio trabajaba principalmente con funciones, objetos y arrays. Después aprendí a conectar JavaScript con HTML y a utilizar eventos para que las operaciones se realizaran mediante formularios, sin depender de cuadros de diálogo nativos.

Uno de los aprendizajes más importantes fue `localStorage`: antes los datos se perdían al actualizar la página; ahora puedo guardarlos y recuperarlos, junto con las cuentas y los movimientos registrados.

También comprendí mejor el asincronismo. Mediante ejercicios prácticos y la carga de archivos JSON aprendí a utilizar `fetch()`, `async/await` y el manejo de errores.

Finalmente, practiqué cómo organizar mejor el código mediante módulos y funciones reutilizables, y cómo modificar el diseño con CSS sin alterar la lógica que ya funciona.

## Alcance y limitaciones

- Banco App es un **simulador con fines educativos**, no un sistema bancario real.
- No realiza movimientos de dinero verdadero ni se conecta a bancos o servicios financieros.
- No dispone de registro, autenticación ni servidor para almacenar datos bancarios reales.
- La información de prueba se guarda localmente en el navegador.
- Las transferencias bancarias no están implementadas ni forman parte de las funcionalidades actuales.

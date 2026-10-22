let datosGuardados = [];
let errorAlRecuperar = false;
let puedeRegistrar = true;

try {
  const textoGuardado = localStorage.getItem("usuariosBanco");

  datosGuardados = JSON.parse(textoGuardado ?? "[]");

  if (!Array.isArray(datosGuardados)) {
    throw new Error("Los datos guardados no son un array.");
  }
} catch (error) {
  errorAlRecuperar = true;
  datosGuardados = [];

  console.error("Error al recuperar los usuarios:", error);

  try {
    const respaldoExitoso = respaldarUsuariosDañados();

    if (!respaldoExitoso) {
      puedeRegistrar = false;
    }
  } catch (errorRespaldo) {
    puedeRegistrar = false;

    console.error("No se pudo crear el respaldo:", errorRespaldo);
  }
}

function respaldarUsuariosDañados() {
  const claveOriginal = "usuariosBanco";
  const claveRespaldo = "usuariosBanco_respaldo";

  const datosOriginales = localStorage.getItem(claveOriginal);

  if (datosOriginales === null) {
    return true;
  }

  if (localStorage.getItem(claveRespaldo) !== null) {
    return false;
  }

  localStorage.setItem(claveRespaldo, datosOriginales);

  if (localStorage.getItem(claveRespaldo) !== datosOriginales) {
    return false;
  }

  localStorage.removeItem(claveOriginal);

  return true;
}

const cuentasDisponibles = [
  { id: 200, tipo: "Ahorro" },
  { id: 300, tipo: "Corriente" },
];

//Creacion de la clase NuevoUsuario
class NuevoUsuario {
  constructor(id, titular, correo, edad) {
    this.id = id;
    this.titular = titular;
    this.correo = correo;
    this.edad = edad;

    this.cuentas = [
      {
        idCuenta: 100,
        tipoDeCuenta: "Normal",
        saldo: 0,
        historial: [],
      },
    ];

    this.historialGeneral = [];
  }

  consultarSaldo(idCuenta) {
    const cuenta = this.cuentas.find((cuenta) => cuenta.idCuenta === idCuenta);

    if (cuenta) {
      return cuenta.saldo;
    }

    return null;
  }

  depositar(idCuenta, monto) {
    if (monto > 0 && Number.isFinite(monto)) {
      const cuenta = this.cuentas.find(
        (cuenta) => cuenta.idCuenta === idCuenta,
      );

      if (cuenta) {
        cuenta.saldo += monto;

        cuenta.historial.push({
          movimiento: "Depósito",
          monto: monto,
          fecha: new Date(),
        });

        this.historialGeneral.push({
          movimiento: "Depósito",
          tipoDeCuenta: cuenta.tipoDeCuenta,
          monto: monto,
          fecha: new Date(),
        });

        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  retirar(idCuenta, monto) {
    if (monto > 0 && Number.isFinite(monto)) {
      const cuenta = this.cuentas.find(
        (cuenta) => cuenta.idCuenta === idCuenta,
      );

      if (cuenta) {
        if (cuenta.saldo >= monto) {
          cuenta.saldo -= monto;

          cuenta.historial.push({
            movimiento: "Retiro",
            monto: monto,
            fecha: new Date(),
          });

          this.historialGeneral.push({
            movimiento: "Retiro",
            tipoDeCuenta: cuenta.tipoDeCuenta,
            monto: monto,
            fecha: new Date(),
          });

          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

const usuarios = datosGuardados.map((datos) => {
  const usuario = new NuevoUsuario(
    datos.id,
    datos.titular,
    datos.correo,
    datos.edad,
  );

  usuario.cuentas = datos.cuentas;
  usuario.historialGeneral = datos.historialGeneral;

  usuario.cuentas.forEach((cuenta) => {
    cuenta.historial.forEach((movimiento) => {
      movimiento.fecha = new Date(movimiento.fecha);
    });
  });

  usuario.historialGeneral.forEach((movimiento) => {
    movimiento.fecha = new Date(movimiento.fecha);
  });

  return usuario;
});

function guardarUsuarios() {
  localStorage.setItem("usuariosBanco", JSON.stringify(usuarios));
}

// Función para validar el correo electrónico
function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

const formularioRegistro = document.querySelector("#formRegistro");

//Formulario de registro de usuario
formularioRegistro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (!puedeRegistrar) {
    document.querySelector("#mensajeRegistro").textContent =
      "⚠️ No se puede crear un usuario porque existe información corrupta que no fue respaldada.";

    return;
  }

  const titular = document.querySelector("#inputNombre").value.trim();
  const correo = document.querySelector("#inputCorreo").value.trim();
  const edad = Number(document.querySelector("#inputEdad").value);

  const mensajeRegistro = document.querySelector("#mensajeRegistro");

  if (titular === "") {
    mensajeRegistro.textContent = "Ingresa un nombre válido.";
    return;
  }

  if (!correoValido(correo)) {
    mensajeRegistro.textContent = "Ingresa un correo válido.";
    return;
  }

  if (!Number.isInteger(edad) || edad <= 0) {
    mensajeRegistro.textContent = "Ingresa una edad válida.";
    return;
  }

  const nuevoUsuario = new NuevoUsuario(
    usuarios.length + 1,
    titular,
    correo,
    edad,
  );

  usuarios.push(nuevoUsuario);

  guardarUsuarios();

  document.querySelector("#seccionRegistro").hidden = true;
  document.querySelector("#seccionBanco").hidden = false;

  mostrarAvisoBancario();

  document.querySelector("#saludoUsuario").textContent =
    `¡Bienvenido, ${nuevoUsuario.titular}!`;

  renderizarCuentas(nuevoUsuario);
  actualizarCuentasDeposito(nuevoUsuario);
  actualizarCuentasRetiro(nuevoUsuario);
  actualizarCuentasHistorial(nuevoUsuario);
  actualizarHistorialVisible();
});

// Renderizar cuentas del usuario
function renderizarCuentas(usuario) {
  const contenedor = document.querySelector("#contenedorCuentas");

  contenedor.innerHTML = "";

  usuario.cuentas.forEach((cuenta) => {
    const { idCuenta, tipoDeCuenta, saldo } = cuenta;
    contenedor.innerHTML += `
      <div class="tarjetaCuenta">
        <h3>💳 Cuenta ${tipoDeCuenta}</h3>
        <p>ID: ${idCuenta}</p>
        <p>Saldo disponible:</p>
        <h2>$${saldo.toLocaleString("es-CL")}</h2>

        <button
          type="button"
          class="btnEliminarCuenta"
          data-id="${idCuenta}"
        >
          🗑️ Eliminar cuenta
        </button>
      </div>
    `;
  });
}

let temporizadorAviso;

function mostrarAvisoBancario() {
  clearTimeout(temporizadorAviso);

  temporizadorAviso = setTimeout(() => {
    if (document.querySelector("#seccionBanco").hidden) {
      return;
    }

    Toastify({
      text: "🔔 Recuerda revisar periódicamente los movimientos de tus cuentas.",
      duration: 5000,
      gravity: "top",
      position: "right",
      close: true,
      stopOnFocus: true,
      style: {
        background: "#263b35",
        color: "#d5e4dc",
        border: "1px solid #446d5d",
        borderRadius: "10px",
      },
    }).showToast();
  }, 3000);
}

function mostrarErrorRecuperacion() {
  if (!errorAlRecuperar) {
    return;
  }

  const mensaje = document.querySelector("#mensajeRegistro");

  if (puedeRegistrar) {
    mensaje.textContent =
      "⚠️ Se detectaron datos incorrectos. Se creó un respaldo y puedes registrar un nuevo usuario.";
  } else {
    mensaje.textContent =
      "⚠️ No se pudieron recuperar ni respaldar los datos. No se permitirá un nuevo registro para evitar perder información.";
  }

  mensaje.style.color = "#fca5a5";
}

const formularioCuenta = document.querySelector("#formAgregarCuenta");

//Formulario para agregar una nueva cuenta
formularioCuenta.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuario = usuarios[0];

  if (!usuario) {
    mostrarMensajeCuenta("No existe un usuario registrado.", false);
    return;
  }

  const idSeleccionado = Number(document.querySelector("#tipoCuenta").value);

  const cuentaElegida = cuentasDisponibles.find(
    (cuenta) => cuenta.id === idSeleccionado,
  );

  if (!cuentaElegida) {
    mostrarMensajeCuenta("Selecciona una cuenta válida.", false);
    return;
  }

  const cuentaYaExiste = usuario.cuentas.some(
    (cuenta) => cuenta.idCuenta === cuentaElegida.id,
  );

  if (cuentaYaExiste) {
    mostrarMensajeCuenta(`Ya tienes una cuenta ${cuentaElegida.tipo}.`, false);
    return;
  }

  usuario.cuentas.push({
    idCuenta: cuentaElegida.id,
    tipoDeCuenta: cuentaElegida.tipo,
    saldo: 0,
    historial: [],
  });

  guardarUsuarios();

  renderizarCuentas(usuario);
  actualizarCuentasDeposito(usuario);
  actualizarCuentasRetiro(usuario);
  actualizarCuentasHistorial(usuario);

  mostrarMensajeCuenta(
    `Cuenta ${cuentaElegida.tipo} creada correctamente.`,
    true,
  );

  formularioCuenta.reset();
});

// Función para mostrar mensajes de éxito o error al agregar una cuenta
function mostrarMensajeCuenta(mensaje, exito) {
  const elementoMensaje = document.querySelector("#mensajeCuenta");

  elementoMensaje.textContent = mensaje;

  if (exito) {
    elementoMensaje.style.color = "#86efac";
  } else {
    elementoMensaje.style.color = "#fca5a5";
  }
}

// Función para actualizar el selector de cuentas en el formulario de depósito
function actualizarCuentasDeposito(usuario) {
  const selector = document.querySelector("#cuentaDeposito");

  selector.innerHTML = `
    <option value="">Selecciona una cuenta</option>
  `;

  usuario.cuentas.forEach((cuenta) => {
    selector.innerHTML += `
      <option value="${cuenta.idCuenta}">
        ${cuenta.tipoDeCuenta} - ID ${cuenta.idCuenta}
      </option>
    `;
  });
}

const formularioDeposito = document.querySelector("#formDeposito");

//Formulario para realizar un depósito
formularioDeposito.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuario = usuarios[0];
  const mensajeDeposito = document.querySelector("#mensajeDeposito");

  if (!usuario) {
    mensajeDeposito.textContent = "⚠️ No existe un usuario registrado.";
    mensajeDeposito.style.color = "#fca5a5";
    return;
  }

  const idCuenta = Number(document.querySelector("#cuentaDeposito").value);

  const monto = Number(document.querySelector("#montoDeposito").value);

  const cuentaExiste = usuario.cuentas.some(
    (cuenta) => cuenta.idCuenta === idCuenta,
  );

  if (!cuentaExiste) {
    mensajeDeposito.textContent = "⚠️ Selecciona una cuenta válida.";
    mensajeDeposito.style.color = "#fca5a5";
    return;
  }

  if (!Number.isFinite(monto) || monto <= 0) {
    mensajeDeposito.textContent = "⚠️ Ingresa un monto mayor que $0.";
    mensajeDeposito.style.color = "#fca5a5";
    return;
  }

  const depositoExitoso = usuario.depositar(idCuenta, monto);

  if (depositoExitoso) {
    guardarUsuarios();

    renderizarCuentas(usuario);

    actualizarHistorialVisible();

    mensajeDeposito.textContent = `✅ Depósito de $${monto.toLocaleString("es-CL")} realizado correctamente.`;

    mensajeDeposito.style.color = "#86efac";

    formularioDeposito.reset();
  }
});

// Función para actualizar el selector de cuentas en el formulario de retiro
function actualizarCuentasRetiro(usuario) {
  const selector = document.querySelector("#cuentaRetiro");

  selector.innerHTML = `
    <option value="">Selecciona una cuenta</option>
  `;

  usuario.cuentas.forEach((cuenta) => {
    selector.innerHTML += `
      <option value="${cuenta.idCuenta}">
        ${cuenta.tipoDeCuenta} - ID ${cuenta.idCuenta}
      </option>
    `;
  });
}

const formularioRetiro = document.querySelector("#formRetiro");

//Formulario para realizar un retiro
formularioRetiro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuario = usuarios[0];
  const mensajeRetiro = document.querySelector("#mensajeRetiro");

  if (!usuario) {
    mensajeRetiro.textContent = "⚠️ No existe un usuario registrado.";
    mensajeRetiro.style.color = "#fca5a5";
    return;
  }

  const idCuenta = Number(document.querySelector("#cuentaRetiro").value);

  const monto = Number(document.querySelector("#montoRetiro").value);

  const cuentaSeleccionada = usuario.cuentas.find(
    (cuenta) => cuenta.idCuenta === idCuenta,
  );

  if (!cuentaSeleccionada) {
    mensajeRetiro.textContent = "⚠️ Selecciona una cuenta válida.";
    mensajeRetiro.style.color = "#fca5a5";
    return;
  }

  if (!Number.isFinite(monto) || monto <= 0) {
    mensajeRetiro.textContent = "⚠️ Ingresa un monto mayor que $0.";
    mensajeRetiro.style.color = "#fca5a5";
    return;
  }

  if (cuentaSeleccionada.saldo < monto) {
    mensajeRetiro.textContent = `⚠️ Fondos insuficientes. Saldo disponible: $${cuentaSeleccionada.saldo.toLocaleString("es-CL")}.`;

    mensajeRetiro.style.color = "#fca5a5";
    return;
  }

  const retiroExitoso = usuario.retirar(idCuenta, monto);

  if (retiroExitoso) {
    guardarUsuarios();

    renderizarCuentas(usuario);

    actualizarHistorialVisible();

    mensajeRetiro.textContent = `✅ Retiro de $${monto.toLocaleString("es-CL")} realizado correctamente.`;

    mensajeRetiro.style.color = "#86efac";

    formularioRetiro.reset();
  }
});

// Función para actualizar el selector de cuentas en el historial
function actualizarCuentasHistorial(usuario) {
  const selector = document.querySelector("#selectorHistorial");

  selector.innerHTML = `
    <option value="general">Historial general</option>
  `;

  usuario.cuentas.forEach((cuenta) => {
    selector.innerHTML += `
      <option value="${cuenta.idCuenta}">
        ${cuenta.tipoDeCuenta} - ID ${cuenta.idCuenta}
      </option>
    `;
  });
}

function restaurarInterfaz() {
  const usuario = usuarios[0];

  if (!usuario) {
    return;
  }

  const nombreUsuario = usuario?.titular ?? "Invitado";

  document.querySelector("#seccionRegistro").hidden = true;
  document.querySelector("#seccionBanco").hidden = false;

  mostrarAvisoBancario();

  document.querySelector("#saludoUsuario").textContent =
    `¡Bienvenido, ${nombreUsuario}!`;

  renderizarCuentas(usuario);
  actualizarCuentasDeposito(usuario);
  actualizarCuentasRetiro(usuario);
  actualizarCuentasHistorial(usuario);
  actualizarHistorialVisible();
}

// Función para renderizar el historial de movimientos
function renderizarHistorial(
  movimientos,
  mostrarCuenta,
  sinCoincidencias = false,
) {
  const contenedor = document.querySelector("#contenedorHistorial");

  contenedor.innerHTML = "";

  if (movimientos.length === 0) {
    contenedor.innerHTML = sinCoincidencias
      ? "<p>🔎 No se encontraron movimientos que coincidan con tu búsqueda.</p>"
      : "<p>📭 No hay movimientos registrados.</p>";

    return;
  }

  movimientos
    .slice()
    .reverse()
    .forEach((movimiento) => {
      const {
        movimiento: tipoMovimiento,
        tipoDeCuenta,
        monto,
        fecha,
      } = movimiento;

      const esDeposito = tipoMovimiento === "Depósito";

      const claseMonto = esDeposito ? "montoDeposito" : "montoRetiro";

      const signo = esDeposito ? "+" : "-";

      const informacionCuenta = mostrarCuenta
        ? `<p>Cuenta: ${tipoDeCuenta ?? "No especificada"}</p>`
        : "";

      contenedor.innerHTML += `
      <div class="movimiento">
        <p><strong>${tipoMovimiento}</strong></p>

        ${informacionCuenta}

        <p class="${claseMonto}">
          ${signo}$${monto.toLocaleString("es-CL")}
        </p>

        <p>
          ${fecha.toLocaleString("es-CL")}
        </p>
      </div>
    `;
    });
}

function actualizarHistorialVisible() {
  const usuario = usuarios[0];
  const contenedor = document.querySelector("#contenedorHistorial");

  if (!usuario) {
    contenedor.innerHTML = "<p>📭 No hay movimientos registrados.</p>";
    return;
  }

  contenedor.hidden = false;

  const opcion = document.querySelector("#selectorHistorial").value;

  const busqueda = document
    .querySelector("#buscadorHistorial")
    .value.trim()
    .toLocaleLowerCase("es-CL");

  let movimientos = [];
  let mostrarCuenta = false;
  let nombreCuenta = "";

  if (opcion === "general") {
    movimientos = usuario.historialGeneral;
    mostrarCuenta = true;
  } else {
    const idCuenta = Number(opcion);

    const cuenta = usuario.cuentas.find(
      (cuenta) => cuenta.idCuenta === idCuenta,
    );

    if (!cuenta) {
      contenedor.textContent = "⚠️ La cuenta seleccionada no existe.";
      return;
    }

    movimientos = cuenta.historial;
    nombreCuenta = cuenta.tipoDeCuenta;
  }

  const movimientosFiltrados = movimientos.filter((movimiento) => {
    const textoMovimiento = `
      ${movimiento.movimiento}
      ${movimiento.tipoDeCuenta ?? nombreCuenta}
      ${movimiento.monto}
      ${movimiento.monto.toLocaleString("es-CL")}
      ${movimiento.destinatario ?? ""}
    `.toLocaleLowerCase("es-CL");

    return textoMovimiento.includes(busqueda);
  });

  const sinCoincidencias =
    movimientos.length > 0 && movimientosFiltrados.length === 0;

  renderizarHistorial(movimientosFiltrados, mostrarCuenta, sinCoincidencias);
}

const selectorHistorial = document.querySelector("#selectorHistorial");

const buscadorHistorial = document.querySelector("#buscadorHistorial");

selectorHistorial.addEventListener("change", function () {
  actualizarHistorialVisible();
});

buscadorHistorial.addEventListener("input", function () {
  actualizarHistorialVisible();
});

let consejosBancarios = [];
let indiceGrupoConsejos = 0;

function mostrarGrupoConsejos() {
  const contenedor = document.querySelector("#contenedorConsejos");

  contenedor.innerHTML = "";

  const inicio = indiceGrupoConsejos * 3;
  const fin = inicio + 3;

  const grupo = consejosBancarios.slice(inicio, fin);

  grupo.forEach((consejo) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjetaConsejo");

    const titulo = document.createElement("h4");
    titulo.textContent = consejo.titulo;

    const descripcion = document.createElement("p");
    descripcion.textContent = consejo.descripcion;

    tarjeta.append(titulo, descripcion);
    contenedor.appendChild(tarjeta);
  });
}

async function cargarConsejos() {
  const estado = document.querySelector("#estadoConsejos");
  const boton = document.querySelector("#btnActualizarConsejos");

  estado.textContent = "⏳ Cargando consejos bancarios...";
  estado.style.color = "#aab4c2";

  boton.disabled = true;
  boton.hidden = true;

  try {
    const respuesta = await fetch("./data/consejos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo acceder al archivo de consejos.");
    }

    const consejos = await respuesta.json();

    if (!Array.isArray(consejos)) {
      throw new Error("El archivo no contiene una lista de consejos.");
    }

    if (consejos.length === 0) {
      throw new Error("No hay consejos disponibles.");
    }

    consejosBancarios = consejos;
    indiceGrupoConsejos = 0;

    mostrarGrupoConsejos();

    estado.textContent = "";

    boton.hidden = consejosBancarios.length <= 3;
  } catch (error) {
    consejosBancarios = [];
    document.querySelector("#contenedorConsejos").innerHTML = "";

    estado.textContent = "⚠️ No se pudieron mostrar los consejos bancarios.";

    estado.style.color = "#fca5a5";

    boton.hidden = true;
  } finally {
    boton.disabled = consejosBancarios.length <= 3;
  }
}

const botonConsejos = document.querySelector("#btnActualizarConsejos");

botonConsejos.addEventListener("click", function () {
  const cantidadGrupos = Math.ceil(consejosBancarios.length / 3);

  indiceGrupoConsejos++;

  if (indiceGrupoConsejos >= cantidadGrupos) {
    indiceGrupoConsejos = 0;
  }

  mostrarGrupoConsejos();
});

const contenedorCuentas = document.querySelector("#contenedorCuentas");

// Función para eliminar una cuenta del DOM y del usuario
contenedorCuentas.addEventListener("click", function (evento) {
  if (evento.target.classList.contains("btnEliminarCuenta")) {
    const idCuenta = Number(evento.target.dataset.id);

    eliminarCuentaDOM(idCuenta);
  }
});

// Función para eliminar una cuenta del DOM y del usuario

async function eliminarCuentaDOM(idCuenta) {
  const usuario = usuarios[0];
  const mensaje = document.querySelector("#mensajeEliminacion");

  if (!usuario) {
    mensaje.textContent = "⚠️ No existe un usuario registrado.";
    mensaje.style.color = "#fca5a5";
    return;
  }

  const indiceCuenta = usuario.cuentas.findIndex(
    (cuenta) => cuenta.idCuenta === idCuenta,
  );

  if (indiceCuenta === -1) {
    mensaje.textContent = "⚠️ La cuenta no existe.";
    mensaje.style.color = "#fca5a5";
    return;
  }

  const cuenta = usuario.cuentas[indiceCuenta];

  const esCuentaNormal = idCuenta === 100;

  const resultado = await Swal.fire({
    title: "¿Eliminar cuenta?",
    text: esCuentaNormal
      ? "Esta acción eliminará tu usuario y todas sus cuentas."
      : `¿Deseas eliminar la cuenta ${cuenta.tipoDeCuenta} (ID ${idCuenta})?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#9f4048",
    cancelButtonColor: "#566171",
    background: "#282e38",
    color: "#e5e7eb",
  });

  if (!resultado.isConfirmed) {
    mensaje.textContent = "↩️ Eliminación cancelada.";
    mensaje.style.color = "#aab4c2";
    return;
  }

  if (esCuentaNormal) {
    usuarios.splice(0, 1);

    localStorage.removeItem("usuariosBanco");

    document.querySelector("#seccionBanco").hidden = true;
    document.querySelector("#seccionRegistro").hidden = false;

    document.querySelector("#formRegistro").reset();

    document.querySelector("#contenedorCuentas").innerHTML = "";
    document.querySelector("#contenedorHistorial").innerHTML = "";

    document.querySelector("#buscadorHistorial").value = "";

    document.querySelector("#contenedorHistorial").hidden = true;

    document.querySelector("#mensajeRegistro").textContent =
      "✅ Usuario eliminado. Puedes crear uno nuevo.";

    document.querySelector("#mensajeCuenta").textContent = "";
    document.querySelector("#mensajeDeposito").textContent = "";
    document.querySelector("#mensajeRetiro").textContent = "";
    document.querySelector("#mensajeEliminacion").textContent = "";

    return;
  }

  usuario.cuentas.splice(indiceCuenta, 1);

  guardarUsuarios();

  renderizarCuentas(usuario);
  actualizarCuentasDeposito(usuario);
  actualizarCuentasRetiro(usuario);
  actualizarCuentasHistorial(usuario);

  actualizarHistorialVisible();

  mensaje.textContent = `✅ Cuenta ${cuenta.tipoDeCuenta} eliminada correctamente.`;

  mensaje.style.color = "#86efac";
}

restaurarInterfaz();
mostrarErrorRecuperacion();
cargarConsejos();

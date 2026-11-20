import { NuevoUsuario } from "./banco.js";
import {
  obtenerDatos,
  guardarUsuarios,
  recuperarUsuarios,
  respaldarUsuariosDañados,
  validarUsuariosGuardados,
} from "./datos.js";

let datosGuardados = [];
let errorAlRecuperar = false;
let puedeRegistrar = true;

try {
  datosGuardados = recuperarUsuarios();

  validarUsuariosGuardados(datosGuardados);
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

let cuentasDisponibles = [];

async function cargarCuentas() {
  const selector = document.querySelector("#tipoCuenta");
  const boton = document.querySelector("#formAgregarCuenta button");
  const mensaje = document.querySelector("#mensajeCuenta");

  selector.disabled = true;
  boton.disabled = true;

  try {
    const cuentas = await obtenerDatos("./data/cuentas.json");

    if (!Array.isArray(cuentas) || cuentas.length === 0) {
      throw new Error("El archivo de cuentas no contiene datos válidos.");
    }

    cuentasDisponibles = cuentas;

    selector.innerHTML = '<option value="">Selecciona una cuenta</option>';

    cuentasDisponibles.forEach((cuenta) => {
      const opcion = document.createElement("option");

      opcion.value = cuenta.id;
      opcion.textContent = cuenta.tipo;

      selector.appendChild(opcion);
    });

    mensaje.textContent = "";
  } catch (error) {
    cuentasDisponibles = [];

    mensaje.textContent = "⚠️ No se pudieron cargar los tipos de cuenta.";

    mensaje.style.color = "#fca5a5";

    console.error("Error al cargar las cuentas:", error);
  } finally {
    const cuentasCargadas = cuentasDisponibles.length > 0;

    selector.disabled = !cuentasCargadas;
    boton.disabled = !cuentasCargadas;
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

function ejecutarOperacionSegura(usuario, operacion) {
  const respaldoCuentas = structuredClone(usuario.cuentas);
  const respaldoHistorial = structuredClone(usuario.historialGeneral);

  try {
    const resultado = operacion();

    if (!resultado) {
      return false;
    }

    guardarUsuarios(usuarios);

    return true;
  } catch (error) {
    usuario.cuentas = respaldoCuentas;
    usuario.historialGeneral = respaldoHistorial;

    console.error("No fue posible guardar la operación:", error);

    return false;
  }
}

function iniciarUsuarioFicticio() {
  if (!puedeRegistrar) {
    return;
  }

  if (usuarios.length === 0) {
    const usuarioFicticio = new NuevoUsuario(
      1,
      "Usuario de prueba",
      "demo@bancoapp.cl",
      18,
    );

    usuarios.push(usuarioFicticio);

    guardarUsuarios(usuarios);
  }
}

function renderizarCuentas(usuario) {
  const contenedor = document.querySelector("#contenedorCuentas");

  contenedor.innerHTML = "";

  usuario.cuentas.forEach((cuenta) => {
    const { idCuenta, tipoDeCuenta, saldo } = cuenta;

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjetaCuenta");

    const titulo = document.createElement("h3");
    titulo.textContent = `💳 Cuenta ${tipoDeCuenta}`;

    const identificador = document.createElement("p");
    identificador.textContent = `ID: ${idCuenta}`;

    const textoSaldo = document.createElement("p");
    textoSaldo.textContent = "Saldo disponible:";

    const saldoCuenta = document.createElement("h2");
    saldoCuenta.textContent = `$${saldo.toLocaleString("es-CL")}`;

    tarjeta.append(titulo, identificador, textoSaldo, saldoCuenta);

    if (idCuenta !== 100) {
      const botonEliminar = document.createElement("button");

      botonEliminar.type = "button";
      botonEliminar.classList.add("btnEliminarCuenta");
      botonEliminar.dataset.id = idCuenta;
      botonEliminar.textContent = "🗑️ Eliminar cuenta";

      tarjeta.appendChild(botonEliminar);
    }

    contenedor.appendChild(tarjeta);
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

  const mensaje = document.querySelector("#mensajeSistema");

  if (puedeRegistrar) {
    mensaje.textContent =
      "⚠️ Se detectaron datos incorrectos y se creó un respaldo.";
  } else {
    mensaje.textContent =
      "⚠️ No se pudieron recuperar ni respaldar los datos. El simulador está bloqueado para evitar pérdida de información.";
  }

  mensaje.style.color = "#fca5a5";
}

const formularioCuenta = document.querySelector("#formAgregarCuenta");

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

  const cuentaCreada = ejecutarOperacionSegura(usuario, () => {
    usuario.cuentas.push({
      idCuenta: cuentaElegida.id,
      tipoDeCuenta: cuentaElegida.tipo,
      saldo: 0,
      historial: [],
    });

    return true;
  });

  if (!cuentaCreada) {
    mostrarMensajeCuenta("No fue posible crear o guardar la cuenta.", false);
    return;
  }

  renderizarCuentas(usuario);
  actualizarSelectoresCuentas(usuario);

  mostrarMensajeCuenta(
    `Cuenta ${cuentaElegida.tipo} creada correctamente.`,
    true,
  );

  formularioCuenta.reset();
});

function mostrarMensajeCuenta(mensaje, exito) {
  const elementoMensaje = document.querySelector("#mensajeCuenta");

  elementoMensaje.textContent = mensaje;

  if (exito) {
    elementoMensaje.style.color = "#86efac";
  } else {
    elementoMensaje.style.color = "#fca5a5";
  }
}

function llenarSelectorCuentas(selector, usuario) {
  usuario.cuentas.forEach((cuenta) => {
    const opcion = document.createElement("option");

    opcion.value = cuenta.idCuenta;

    opcion.textContent = `${cuenta.tipoDeCuenta} - ID ${cuenta.idCuenta}`;

    selector.appendChild(opcion);
  });
}

function actualizarCuentasDeposito(usuario) {
  const selector = document.querySelector("#cuentaDeposito");

  selector.innerHTML = '<option value="">Selecciona una cuenta</option>';

  llenarSelectorCuentas(selector, usuario);
}

const formularioDeposito = document.querySelector("#formDeposito");

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

  const detalle = document.querySelector("#detalleDeposito").value.trim();

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

  const depositoExitoso = ejecutarOperacionSegura(usuario, () => {
    return usuario.depositar(idCuenta, monto, detalle);
  });

  if (depositoExitoso) {
    renderizarCuentas(usuario);

    actualizarHistorialVisible();

    mensajeDeposito.textContent = `✅ Depósito de $${monto.toLocaleString("es-CL")} realizado correctamente.`;

    mensajeDeposito.style.color = "#86efac";

    formularioDeposito.reset();
  } else {
    mensajeDeposito.textContent =
      "⚠️ No se pudo completar o guardar el depósito.";

    mensajeDeposito.style.color = "#fca5a5";
  }
});

function actualizarCuentasRetiro(usuario) {
  const selector = document.querySelector("#cuentaRetiro");

  selector.innerHTML = '<option value="">Selecciona una cuenta</option>';

  llenarSelectorCuentas(selector, usuario);
}

const formularioRetiro = document.querySelector("#formRetiro");

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

  const detalle = document.querySelector("#detalleRetiro").value.trim();

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

  const retiroExitoso = ejecutarOperacionSegura(usuario, () => {
    return usuario.retirar(idCuenta, monto, detalle);
  });

  if (retiroExitoso) {
    renderizarCuentas(usuario);

    actualizarHistorialVisible();

    mensajeRetiro.textContent = `✅ Retiro de $${monto.toLocaleString("es-CL")} realizado correctamente.`;

    mensajeRetiro.style.color = "#86efac";

    formularioRetiro.reset();
  } else {
    mensajeRetiro.textContent = "⚠️ No se pudo completar o guardar el retiro.";

    mensajeRetiro.style.color = "#fca5a5";
  }
});

function actualizarCuentasHistorial(usuario) {
  const selector = document.querySelector("#selectorHistorial");

  selector.innerHTML = '<option value="general">Historial general</option>';

  llenarSelectorCuentas(selector, usuario);
}

function actualizarSelectoresCuentas(usuario) {
  actualizarCuentasDeposito(usuario);
  actualizarCuentasRetiro(usuario);
  actualizarCuentasHistorial(usuario);
}

function restaurarInterfaz() {
  const usuario = usuarios[0];

  if (!usuario) {
    document.querySelector("#seccionBanco").hidden = true;
    return;
  }

  const nombreUsuario = usuario?.titular ?? "Invitado";

  document.querySelector("#seccionBanco").hidden = false;

  mostrarAvisoBancario();

  document.querySelector("#saludoUsuario").textContent =
    `¡Bienvenido, ${nombreUsuario}!`;

  renderizarCuentas(usuario);
  actualizarSelectoresCuentas(usuario);
  actualizarHistorialVisible();
}

function renderizarHistorial(
  movimientos,
  mostrarCuenta,
  sinCoincidencias = false,
) {
  const contenedor = document.querySelector("#contenedorHistorial");

  contenedor.innerHTML = "";

  if (movimientos.length === 0) {
    contenedor.textContent = sinCoincidencias
      ? "🔎 No se encontraron movimientos que coincidan con los filtros."
      : "📭 No hay movimientos registrados.";

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
        detalle,
      } = movimiento;

      const esDeposito = tipoMovimiento === "Depósito";

      const claseMonto = esDeposito ? "montoDeposito" : "montoRetiro";

      const signo = esDeposito ? "+" : "-";

      const tarjeta = document.createElement("div");
      tarjeta.classList.add("movimiento");

      const titulo = document.createElement("p");
      const tituloNegrita = document.createElement("strong");
      tituloNegrita.textContent = tipoMovimiento;
      titulo.appendChild(tituloNegrita);

      tarjeta.appendChild(titulo);

      if (mostrarCuenta) {
        const textoCuenta = document.createElement("p");
        textoCuenta.textContent = `Cuenta: ${tipoDeCuenta ?? "No especificada"}`;

        tarjeta.appendChild(textoCuenta);
      }

      const textoMonto = document.createElement("p");
      textoMonto.classList.add(claseMonto);
      textoMonto.textContent = `${signo}$${monto.toLocaleString("es-CL")}`;

      tarjeta.appendChild(textoMonto);

      if (typeof detalle === "string" && detalle.trim() !== "") {
        const textoDetalle = document.createElement("p");
        textoDetalle.textContent = `📝 Detalle: ${detalle}`;

        tarjeta.appendChild(textoDetalle);
      }

      const textoFecha = document.createElement("p");
      textoFecha.textContent = fecha.toLocaleString("es-CL");

      tarjeta.appendChild(textoFecha);

      contenedor.appendChild(tarjeta);
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

  const tipoSeleccionado = document.querySelector(
    'input[name="tipoMovimiento"]:checked',
  ).value;

  const montoMinimoTexto = document.querySelector("#filtroMontoMinimo").value;

  const montoMaximoTexto = document.querySelector("#filtroMontoMaximo").value;

  const mensajeFiltros = document.querySelector("#mensajeFiltros");

  const minimo = Number(montoMinimoTexto);
  const maximo = Number(montoMaximoTexto);

  const minimoInvalido =
    montoMinimoTexto !== "" && (!Number.isFinite(minimo) || minimo < 0);

  const maximoInvalido =
    montoMaximoTexto !== "" && (!Number.isFinite(maximo) || maximo < 0);

  const rangoInvertido =
    montoMinimoTexto !== "" && montoMaximoTexto !== "" && minimo > maximo;

  if (minimoInvalido || maximoInvalido || rangoInvertido) {
    mensajeFiltros.textContent =
      "⚠️ Revisa los montos: deben ser válidos, positivos o cero, y el mínimo no puede superar al máximo.";

    mensajeFiltros.style.color = "#fca5a5";

    document.querySelector("#contenedorHistorial").textContent = "";
    return;
  }

  mensajeFiltros.textContent = "";

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
    ${movimiento.detalle ?? ""}
    ${movimiento.destinatario ?? ""}
  `.toLocaleLowerCase("es-CL");

    const coincideBusqueda = textoMovimiento.includes(busqueda);

    const coincideTipo =
      tipoSeleccionado === "todos" ||
      movimiento.movimiento === tipoSeleccionado;

    const coincideMinimo =
      montoMinimoTexto === "" || movimiento.monto >= Number(montoMinimoTexto);

    const coincideMaximo =
      montoMaximoTexto === "" || movimiento.monto <= Number(montoMaximoTexto);

    return coincideBusqueda && coincideTipo && coincideMinimo && coincideMaximo;
  });

  const sinCoincidencias =
    movimientos.length > 0 && movimientosFiltrados.length === 0;

  renderizarHistorial(movimientosFiltrados, mostrarCuenta, sinCoincidencias);
}

const selectorHistorial = document.querySelector("#selectorHistorial");

const buscadorHistorial = document.querySelector("#buscadorHistorial");

const opcionesTipoMovimiento = document.querySelectorAll(
  'input[name="tipoMovimiento"]',
);

opcionesTipoMovimiento.forEach((opcion) => {
  opcion.addEventListener("change", actualizarHistorialVisible);
});

selectorHistorial.addEventListener("change", actualizarHistorialVisible);

buscadorHistorial.addEventListener("input", actualizarHistorialVisible);

const filtroMontoMinimo = document.querySelector("#filtroMontoMinimo");

const filtroMontoMaximo = document.querySelector("#filtroMontoMaximo");

filtroMontoMinimo.addEventListener("input", actualizarHistorialVisible);

filtroMontoMaximo.addEventListener("input", actualizarHistorialVisible);

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
    const consejos = await obtenerDatos("./data/consejos.json");

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

contenedorCuentas.addEventListener("click", function (evento) {
  if (evento.target.classList.contains("btnEliminarCuenta")) {
    const idCuenta = Number(evento.target.dataset.id);

    eliminarCuentaDOM(idCuenta);
  }
});

async function eliminarCuentaDOM(idCuenta) {
  const usuario = usuarios[0];
  const mensaje = document.querySelector("#mensajeEliminacion");

  if (!usuario) {
    mensaje.textContent = "⚠️ No existe un usuario registrado.";
    mensaje.style.color = "#fca5a5";
    return;
  }

  if (idCuenta === 100) {
    mensaje.textContent =
      "⚠️ La cuenta Normal es la cuenta principal del simulador y no puede eliminarse individualmente.";

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

  const resultado = await Swal.fire({
    title: "¿Eliminar cuenta?",
    text: `¿Deseas eliminar la cuenta ${cuenta.tipoDeCuenta} (ID ${idCuenta})?`,
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

  const cuentaEliminada = ejecutarOperacionSegura(usuario, () => {
    usuario.cuentas.splice(indiceCuenta, 1);

    return true;
  });

  if (!cuentaEliminada) {
    mensaje.textContent =
      "⚠️ No fue posible eliminar o guardar los cambios de la cuenta.";

    mensaje.style.color = "#fca5a5";
    return;
  }

  renderizarCuentas(usuario);
  actualizarSelectoresCuentas(usuario);

  actualizarHistorialVisible();

  mensaje.textContent = `✅ Cuenta ${cuenta.tipoDeCuenta} eliminada correctamente.`;

  mensaje.style.color = "#86efac";
}

async function reiniciarSimulador() {
  const resultado = await Swal.fire({
    title: "¿Reiniciar Banco App?",
    text: "Se eliminarán todas las cuentas, saldos e historiales de prueba. Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#9f4048",
    cancelButtonColor: "#566171",
    background: "#282e38",
    color: "#e5e7eb",
  });

  if (!resultado.isConfirmed) {
    return;
  }

  const mensaje = document.querySelector("#mensajeReinicio");

  const usuarioFicticio = new NuevoUsuario(
    1,
    "Usuario de prueba",
    "demo@bancoapp.cl",
    18,
  );

  try {
    const clave = "usuariosBanco";
    const datosAnteriores = localStorage.getItem(clave);

    try {
      localStorage.removeItem(clave);

      if (localStorage.getItem(clave) !== null) {
        throw new Error("No se pudieron eliminar los datos anteriores.");
      }

      localStorage.setItem(clave, JSON.stringify([usuarioFicticio]));

      usuarios.splice(0, usuarios.length);
      usuarios.push(usuarioFicticio);
    } catch (error) {
      if (datosAnteriores !== null) {
        try {
          localStorage.setItem(clave, datosAnteriores);
        } catch (errorRecuperacion) {
          console.error(
            "No fue posible restaurar los datos anteriores:",
            errorRecuperacion,
          );
        }
      }

      throw error;
    }

    document.querySelector("#buscadorHistorial").value = "";

    document.querySelector("#filtroMontoMinimo").value = "";
    document.querySelector("#filtroMontoMaximo").value = "";

    document.querySelector(
      'input[name="tipoMovimiento"][value="todos"]',
    ).checked = true;

    document.querySelector("#formDeposito").reset();
    document.querySelector("#formRetiro").reset();
    document.querySelector("#formAgregarCuenta").reset();

    document.querySelector("#mensajeDeposito").textContent = "";
    document.querySelector("#mensajeRetiro").textContent = "";
    document.querySelector("#mensajeCuenta").textContent = "";
    document.querySelector("#mensajeEliminacion").textContent = "";

    restaurarInterfaz();

    mensaje.textContent = "✅ El simulador se reinició correctamente.";

    mensaje.style.color = "#86efac";
  } catch (error) {
    mensaje.textContent = "⚠️ No fue posible reiniciar el simulador.";

    mensaje.style.color = "#fca5a5";

    console.error("Error al reiniciar el simulador:", error);
  }
}

const botonReiniciar = document.querySelector("#btnReiniciarSimulador");

botonReiniciar.addEventListener("click", reiniciarSimulador);

iniciarUsuarioFicticio();
restaurarInterfaz();
mostrarErrorRecuperacion();
cargarConsejos();
cargarCuentas();

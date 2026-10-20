const datosGuardados = JSON.parse(
  localStorage.getItem("usuariosBanco") ?? "[]",
);

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

        console.log(
          `✅ Depósito: $${monto} | ${cuenta.tipoDeCuenta} | Saldo: $${cuenta.saldo}`,
        );

        return true;
      } else {
        console.log("⚠️ La cuenta indicada no existe.");
        return false;
      }
    } else {
      console.log("⚠️ El monto debe ser mayor que $0.");
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

          console.log(
            `✅ Retiro: $${monto} | ${cuenta.tipoDeCuenta} | Saldo: $${cuenta.saldo}`,
          );

          return true;
        } else {
          console.log("⚠️ Fondos insuficientes.");
          return false;
        }
      } else {
        console.log("⚠️ La cuenta indicada no existe.");
        return false;
      }
    } else {
      console.log("⚠️ El monto debe ser mayor que $0.");
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

  document.querySelector("#saludoUsuario").textContent =
    `¡Bienvenido, ${nuevoUsuario.titular}!`;

  renderizarCuentas(nuevoUsuario);
  actualizarCuentasDeposito(nuevoUsuario);
  actualizarCuentasRetiro(nuevoUsuario);
  actualizarCuentasHistorial(nuevoUsuario);

  console.log("Usuario registrado:", nuevoUsuario);
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

  document.querySelector("#saludoUsuario").textContent =
    `¡Bienvenido, ${nombreUsuario}!`;

  renderizarCuentas(usuario);
  actualizarCuentasDeposito(usuario);
  actualizarCuentasRetiro(usuario);
  actualizarCuentasHistorial(usuario);
}

// Función para renderizar el historial de movimientos
function renderizarHistorial(movimientos, mostrarCuenta) {
  const contenedor = document.querySelector("#contenedorHistorial");

  contenedor.innerHTML = "";

  if (movimientos.length === 0) {
    contenedor.innerHTML = `
      <p>📭 No hay movimientos registrados.</p>
    `;
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
  const contenedor = document.querySelector("#contenedorHistorial");

  if (contenedor.hidden) {
    return;
  }

  const usuario = usuarios[0];

  if (!usuario) {
    return;
  }

  const opcion = document.querySelector("#selectorHistorial").value;

  if (opcion === "general") {
    renderizarHistorial(usuario.historialGeneral, true);
    return;
  }

  const idCuenta = Number(opcion);

  const cuenta = usuario.cuentas.find((cuenta) => cuenta.idCuenta === idCuenta);

  if (cuenta) {
    renderizarHistorial(cuenta.historial, false);
  }
}

const formularioHistorial = document.querySelector("#formHistorial");

//Formulario para mostrar el historial de movimientos
formularioHistorial.addEventListener("submit", function (evento) {
  evento.preventDefault();

  document.querySelector("#contenedorHistorial").hidden = false;

  const usuario = usuarios[0];

  if (!usuario) {
    return;
  }

  const opcion = document.querySelector("#selectorHistorial").value;

  if (opcion === "general") {
    renderizarHistorial(usuario.historialGeneral, true);
    return;
  }

  const idCuenta = Number(opcion);

  const cuenta = usuario.cuentas.find((cuenta) => cuenta.idCuenta === idCuenta);

  if (!cuenta) {
    document.querySelector("#contenedorHistorial").textContent =
      "⚠️ La cuenta seleccionada no existe.";
    return;
  }

  renderizarHistorial(cuenta.historial, false);
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
function eliminarCuentaDOM(idCuenta) {
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

  if (idCuenta === 100) {
    const confirmar = confirm(
      "¿Deseas eliminar tu cuenta Normal?\n\n" +
        "Esta acción también eliminará tu usuario y todas sus cuentas.",
    );

    if (!confirmar) {
      mensaje.textContent = "↩️ Eliminación cancelada.";
      mensaje.style.color = "#aab4c2";
      return;
    }

    usuarios.splice(0, 1);

    localStorage.removeItem("usuariosBanco");

    document.querySelector("#seccionBanco").hidden = true;
    document.querySelector("#seccionRegistro").hidden = false;

    document.querySelector("#formRegistro").reset();

    document.querySelector("#contenedorCuentas").innerHTML = "";
    document.querySelector("#contenedorHistorial").innerHTML = "";

    document.querySelector("#contenedorHistorial").hidden = true;

    document.querySelector("#mensajeRegistro").textContent =
      "✅ Usuario eliminado. Puedes crear uno nuevo.";

    document.querySelector("#mensajeCuenta").textContent = "";
    document.querySelector("#mensajeDeposito").textContent = "";
    document.querySelector("#mensajeRetiro").textContent = "";
    document.querySelector("#mensajeEliminacion").textContent = "";

    return;
  }

  const confirmar = confirm(
    `¿Deseas eliminar la cuenta ${cuenta.tipoDeCuenta} (ID ${idCuenta})?`,
  );

  if (!confirmar) {
    mensaje.textContent = "↩️ Eliminación cancelada.";
    mensaje.style.color = "#aab4c2";
    return;
  }

  usuario.cuentas.splice(indiceCuenta, 1);

  guardarUsuarios();

  renderizarCuentas(usuario);
  actualizarCuentasDeposito(usuario);
  actualizarCuentasRetiro(usuario);
  actualizarCuentasHistorial(usuario);

  document.querySelector("#contenedorHistorial").innerHTML = "";

  document.querySelector("#contenedorHistorial").hidden = true;

  mensaje.textContent = `✅ Cuenta ${cuenta.tipoDeCuenta} eliminada correctamente.`;

  mensaje.style.color = "#86efac";
}

restaurarInterfaz();

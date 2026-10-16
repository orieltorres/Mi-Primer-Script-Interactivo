const usuarios = [];

const cuentasDisponibles = [
  { id: 200, tipo: "Ahorro" },
  { id: 300, tipo: "Corriente" },
];

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

function crearNuevoUsuario() {
  let titular = prompt("🏦 Bienvenido a Banco App\n\nIngresa tu nombre:");

  if (titular === null) {
    return null;
  }

  while (titular.trim() === "") {
    titular = prompt(
      "⚠️ El nombre no puede estar vacío.\n\nIngresa tu nombre:",
    );

    if (titular === null) {
      return null;
    }
  }

  let respuestaEdad = prompt("🎂 Ingresa tu edad:");

  if (respuestaEdad === null) {
    return null;
  }

  let edad = parseInt(respuestaEdad);

  while (isNaN(edad) || edad <= 0) {
    respuestaEdad = prompt(
      "⚠️ Edad inválida.\n\nIngresa una edad mayor que 0:",
    );

    if (respuestaEdad === null) {
      return null;
    }

    edad = parseInt(respuestaEdad);
  }

  let correo = prompt("📧 Ingresa tu correo electrónico:");

  if (correo === null) {
    return null;
  }

  while (correo.trim() === "" || !correoValido(correo)) {
    correo = prompt("⚠️ Correo inválido.\n\nIngresa un correo válido:");

    if (correo === null) {
      return null;
    }
  }

  const nuevoUsuario = new NuevoUsuario(
    usuarios.length + 1,
    titular.trim(),
    correo.trim(),
    edad,
  );

  usuarios.push(nuevoUsuario);

  console.log("✅ Usuario registrado:", nuevoUsuario);

  alert(
    `✅ ¡Usuario creado correctamente!\n\n` +
      `👤 ${nuevoUsuario.titular}\n` +
      `🎂 ${nuevoUsuario.edad} años\n` +
      `📧 ${nuevoUsuario.correo}\n\n` +
      `Tu cuenta Normal ya está disponible.`,
  );

  return nuevoUsuario;
}

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

function iniciarMenu() {
  let continuar = true;

  while (continuar) {
    if (usuarios.length === 0) {
      alert("⚠️ No hay ningún usuario registrado.");
      break;
    }

    const opcionMenu = prompt(
      `🏦 BANCO APP\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 Hola, ${usuarios[0].titular}\n\n` +
        `1. 💳 Abrir nueva cuenta\n` +
        `2. 💰 Depositar dinero\n` +
        `3. 📊 Saldos e historial\n` +
        `4. 💸 Retirar dinero\n` +
        `5. 🗑️ Eliminar cuenta\n` +
        `6. 🚪 Salir\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `Selecciona una opción:`,
    );

    switch (opcionMenu) {
      case "1":
        agregarCuenta(0);
        break;

      case "2": {
        pedirDeposito(0);
        break;
      }

      case "3": {
        consultarSaldoEHistorial(0);
        break;
      }

      case "4": {
        pedirRetiro(0);
        break;
      }

      case "5": {
        quitarCuenta(0);

        if (usuarios.length === 0) {
          continuar = false;
        }

        break;
      }

      case "6":
      case null:
        continuar = false;

        alert("👋 Gracias por usar Banco App.\n¡Hasta pronto!");

        break;

      default:
        alert("⚠️ Opción inválida.\nSelecciona una opción del 1 al 6.");
    }
  }
}

function agregarCuenta(indiceUsuario) {
  const usuario = usuarios[indiceUsuario];

  if (!usuario) {
    alert("⚠️ No se encontró el usuario.");
    return;
  }

  if (usuario.cuentas.length === cuentasDisponibles.length + 1) {
    alert("💳 Ya tienes todas las cuentas disponibles.");

    return;
  }

  let opcion = prompt(
    "💳 ABRIR NUEVA CUENTA\n\n" +
      "1. Ahorro\n" +
      "2. Corriente\n\n" +
      "Selecciona una opción:",
  );

  if (opcion === null) {
    return;
  }

  while (opcion !== "1" && opcion !== "2") {
    opcion = prompt(
      "⚠️ Opción inválida.\n\n" +
        "1. Ahorro\n" +
        "2. Corriente\n\n" +
        "Selecciona una opción:",
    );

    if (opcion === null) {
      return;
    }
  }

  let cuentaElegida;

  if (opcion === "1") {
    cuentaElegida = cuentasDisponibles[0];
  } else {
    cuentaElegida = cuentasDisponibles[1];
  }

  let cuentaYaExiste = usuario.cuentas.some(
    (cuenta) => cuenta.tipoDeCuenta === cuentaElegida.tipo,
  );

  while (cuentaYaExiste) {
    opcion = prompt(
      `⚠️ Ya tienes una cuenta ${cuentaElegida.tipo}.\n\n` +
        "Selecciona otra opción:\n" +
        "1. Ahorro\n" +
        "2. Corriente",
    );

    if (opcion === null) {
      return;
    }

    while (opcion !== "1" && opcion !== "2") {
      opcion = prompt(
        "⚠️ Opción inválida.\n\n" + "1. Ahorro\n" + "2. Corriente",
      );

      if (opcion === null) {
        return;
      }
    }

    if (opcion === "1") {
      cuentaElegida = cuentasDisponibles[0];
    } else {
      cuentaElegida = cuentasDisponibles[1];
    }

    cuentaYaExiste = usuario.cuentas.some(
      (cuenta) => cuenta.tipoDeCuenta === cuentaElegida.tipo,
    );
  }

  usuario.cuentas.push({
    idCuenta: cuentaElegida.id,
    tipoDeCuenta: cuentaElegida.tipo,
    saldo: 0,
    historial: [],
  });

  alert(
    `✅ Cuenta creada correctamente.\n\n` +
      `💳 Tipo: ${cuentaElegida.tipo}\n` +
      `🔢 ID: ${cuentaElegida.id}`,
  );

  console.log("💳 Cuentas actuales:", usuario.cuentas);
}

function quitarCuenta(indiceUsuario) {
  const usuario = usuarios[indiceUsuario];

  if (!usuario) {
    alert("⚠️ No se encontró el usuario.");
    return;
  }

  let opcion = prompt(
    "🗑️ ELIMINAR CUENTA\n\n" +
      "Ingresa el ID de la cuenta:\n\n" +
      usuario.cuentas
        .map((cuenta) => `${cuenta.idCuenta} - ${cuenta.tipoDeCuenta}`)
        .join("\n"),
  );

  if (opcion === null) {
    return;
  }

  while (
    !usuario.cuentas.some((cuenta) => cuenta.idCuenta === parseInt(opcion))
  ) {
    opcion = prompt(
      "⚠️ ID inválido.\n\n" +
        "Selecciona una de tus cuentas:\n\n" +
        usuario.cuentas
          .map((cuenta) => `${cuenta.idCuenta} - ${cuenta.tipoDeCuenta}`)
          .join("\n"),
    );

    if (opcion === null) {
      return;
    }
  }

  const idCuenta = parseInt(opcion);

  if (idCuenta === 100) {
    let confirmacion = prompt(
      "⚠️ La cuenta Normal está asociada a tu usuario.\n" +
        "Si la eliminas, también se eliminará tu usuario.\n\n" +
        "¿Deseas continuar? (S/N)",
    );

    if (confirmacion === null) {
      return;
    }

    while (
      confirmacion.toUpperCase() !== "S" &&
      confirmacion.toUpperCase() !== "N"
    ) {
      confirmacion = prompt(
        "⚠️ Opción inválida.\n\n" +
          "S - Confirmar eliminación\n" +
          "N - Cancelar",
      );

      if (confirmacion === null) {
        return;
      }
    }

    if (confirmacion.toUpperCase() === "S") {
      usuarios.splice(indiceUsuario, 1);

      alert("✅ Usuario eliminado correctamente.");
    } else {
      alert("↩️ Eliminación cancelada.");
    }

    return;
  }

  const indexCuenta = usuario.cuentas.findIndex(
    (cuenta) => cuenta.idCuenta === idCuenta,
  );

  usuario.cuentas.splice(indexCuenta, 1);

  alert(`✅ Cuenta ID ${idCuenta} eliminada correctamente.`);

  console.log("💳 Cuentas actuales:", usuario.cuentas);
}

function pedirDeposito(indiceUsuario) {
  const usuario = usuarios[indiceUsuario];

  if (!usuario) {
    alert("⚠️ No se encontró el usuario.");
    return;
  }

  let idIngresado = prompt(
    "💰 REALIZAR DEPÓSITO\n\n" +
      "Selecciona el ID de la cuenta:\n\n" +
      usuario.cuentas
        .map(
          (cuenta) =>
            `${cuenta.idCuenta} - ${cuenta.tipoDeCuenta} | Saldo: $${cuenta.saldo}`,
        )
        .join("\n"),
  );

  if (idIngresado === null) {
    return;
  }

  let idCuenta = Number(idIngresado);

  let cuentaExiste = usuario.cuentas.some(
    (cuenta) => cuenta.idCuenta === idCuenta,
  );

  while (!cuentaExiste) {
    idIngresado = prompt(
      "⚠️ ID de cuenta inválido.\n\n" +
        "Selecciona una de tus cuentas:\n\n" +
        usuario.cuentas
          .map((cuenta) => `${cuenta.idCuenta} - ${cuenta.tipoDeCuenta}`)
          .join("\n"),
    );

    if (idIngresado === null) {
      return;
    }

    idCuenta = Number(idIngresado);

    cuentaExiste = usuario.cuentas.some(
      (cuenta) => cuenta.idCuenta === idCuenta,
    );
  }

  let montoIngresado = prompt("💵 Ingresa el monto a depositar:");

  if (montoIngresado === null) {
    return;
  }

  let monto = Number(montoIngresado);

  while (!Number.isFinite(monto) || monto <= 0) {
    montoIngresado = prompt(
      "⚠️ Monto inválido.\n\nIngresa un monto mayor que $0:",
    );

    if (montoIngresado === null) {
      return;
    }

    monto = Number(montoIngresado);
  }

  const depositoExitoso = usuario.depositar(idCuenta, monto);

  if (depositoExitoso) {
    const cuenta = usuario.cuentas.find(
      (cuenta) => cuenta.idCuenta === idCuenta,
    );

    alert(
      `✅ DEPÓSITO REALIZADO\n\n` +
        `💳 Cuenta: ${cuenta.tipoDeCuenta}\n` +
        `💵 Depositado: $${monto}\n` +
        `💰 Saldo actual: $${cuenta.saldo}`,
    );
  }
}

function pedirRetiro(indiceUsuario) {
  const usuario = usuarios[indiceUsuario];

  if (!usuario) {
    alert("⚠️ No se encontró el usuario.");
    return;
  }

  let idIngresado = prompt(
    "💸 REALIZAR RETIRO\n\n" +
      "Selecciona el ID de la cuenta:\n\n" +
      usuario.cuentas
        .map(
          (cuenta) =>
            `${cuenta.idCuenta} - ${cuenta.tipoDeCuenta} | Saldo: $${cuenta.saldo}`,
        )
        .join("\n"),
  );

  if (idIngresado === null) {
    return;
  }

  let idCuenta = Number(idIngresado);

  let cuentaExiste = usuario.cuentas.some(
    (cuenta) => cuenta.idCuenta === idCuenta,
  );

  while (!cuentaExiste) {
    idIngresado = prompt(
      "⚠️ ID de cuenta inválido.\n\n" +
        "Selecciona una de tus cuentas:\n\n" +
        usuario.cuentas
          .map(
            (cuenta) =>
              `${cuenta.idCuenta} - ${cuenta.tipoDeCuenta} | Saldo: $${cuenta.saldo}`,
          )
          .join("\n"),
    );

    if (idIngresado === null) {
      return;
    }

    idCuenta = Number(idIngresado);

    cuentaExiste = usuario.cuentas.some(
      (cuenta) => cuenta.idCuenta === idCuenta,
    );
  }

  const cuentaSeleccionada = usuario.cuentas.find(
    (cuenta) => cuenta.idCuenta === idCuenta,
  );

  if (cuentaSeleccionada.saldo <= 0) {
    alert(
      `⚠️ La cuenta ${cuentaSeleccionada.tipoDeCuenta} no tiene saldo disponible.`,
    );

    return;
  }

  let montoIngresado = prompt(
    `💵 Ingresa el monto a retirar.\n\n` +
      `Saldo disponible: $${cuentaSeleccionada.saldo}`,
  );

  if (montoIngresado === null) {
    return;
  }

  let monto = Number(montoIngresado);

  while (
    !Number.isFinite(monto) ||
    monto <= 0 ||
    monto > cuentaSeleccionada.saldo
  ) {
    if (Number.isFinite(monto) && monto > cuentaSeleccionada.saldo) {
      montoIngresado = prompt(
        `⚠️ Fondos insuficientes.\n\n` +
          `Saldo disponible: $${cuentaSeleccionada.saldo}\n` +
          `Ingresa otro monto:`,
      );
    } else {
      montoIngresado = prompt(
        `⚠️ Monto inválido.\n\n` +
          `Ingresa un valor entre $1 y $${cuentaSeleccionada.saldo}:`,
      );
    }

    if (montoIngresado === null) {
      return;
    }

    monto = Number(montoIngresado);
  }

  const retiroExitoso = usuario.retirar(idCuenta, monto);

  if (retiroExitoso) {
    alert(
      `✅ RETIRO REALIZADO\n\n` +
        `💳 Cuenta: ${cuentaSeleccionada.tipoDeCuenta}\n` +
        `💵 Retirado: $${monto}\n` +
        `💰 Saldo actual: $${cuentaSeleccionada.saldo}`,
    );
  }
}

function consultarSaldoEHistorial(indiceUsuario) {
  const usuario = usuarios[indiceUsuario];

  if (!usuario) {
    alert("⚠️ No se encontró el usuario.");
    return;
  }

  let mensajeSaldos =
    `📊 SALDOS DE ${usuario.titular.toUpperCase()}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n`;

  usuario.cuentas.forEach((cuenta) => {
    const saldo = usuario.consultarSaldo(cuenta.idCuenta);

    mensajeSaldos +=
      `💳 ${cuenta.tipoDeCuenta}\n` +
      `ID: ${cuenta.idCuenta}\n` +
      `Saldo: $${saldo}\n\n`;
  });

  alert(mensajeSaldos);

  let verHistorial = prompt(
    "📋 ¿Deseas revisar tus movimientos?\n\n" + "S - Sí\n" + "N - No",
  );

  if (verHistorial === null) {
    return;
  }

  verHistorial = verHistorial.toUpperCase();

  while (verHistorial !== "S" && verHistorial !== "N") {
    verHistorial = prompt(
      "⚠️ Opción inválida.\n\n" + "S - Ver historial\n" + "N - Volver al menú",
    );

    if (verHistorial === null) {
      return;
    }

    verHistorial = verHistorial.toUpperCase();
  }

  if (verHistorial === "N") {
    return;
  }

  let opcionesHistorial = "📋 SELECCIONAR HISTORIAL\n\n";

  usuario.cuentas.forEach((cuenta) => {
    opcionesHistorial += `${cuenta.idCuenta} - ${cuenta.tipoDeCuenta}\n`;
  });

  opcionesHistorial += "0 - Historial General";

  let opcionHistorial = prompt(opcionesHistorial);

  if (opcionHistorial === null) {
    return;
  }

  let idHistorial = Number(opcionHistorial);

  let opcionValida =
    idHistorial === 0 ||
    usuario.cuentas.some((cuenta) => cuenta.idCuenta === idHistorial);

  while (!opcionValida) {
    opcionHistorial = prompt("⚠️ Opción inválida.\n\n" + opcionesHistorial);

    if (opcionHistorial === null) {
      return;
    }

    idHistorial = Number(opcionHistorial);

    opcionValida =
      idHistorial === 0 ||
      usuario.cuentas.some((cuenta) => cuenta.idCuenta === idHistorial);
  }

  if (idHistorial === 0) {
    mostrarHistorialGeneral(usuario);
  } else {
    mostrarHistorialCuenta(usuario, idHistorial);
  }
}

function mostrarHistorialCuenta(usuario, idCuenta) {
  const cuenta = usuario.cuentas.find((cuenta) => cuenta.idCuenta === idCuenta);

  if (!cuenta) {
    alert("⚠️ La cuenta no existe.");
    return;
  }

  if (cuenta.historial.length === 0) {
    alert(`📭 La cuenta ${cuenta.tipoDeCuenta} aún no tiene movimientos.`);

    return;
  }

  let mensaje =
    `📋 HISTORIAL - ${cuenta.tipoDeCuenta.toUpperCase()}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n`;

  cuenta.historial.forEach((movimiento, indice) => {
    mensaje +=
      `${indice + 1}. ${movimiento.movimiento}\n` +
      `💵 Monto: $${movimiento.monto}\n` +
      `🕒 ${movimiento.fecha.toLocaleString()}\n\n`;
  });

  alert(mensaje);
}

function mostrarHistorialGeneral(usuario) {
  if (usuario.historialGeneral.length === 0) {
    alert("📭 Aún no tienes movimientos registrados.");

    return;
  }

  let mensaje = "📋 HISTORIAL GENERAL\n" + "━━━━━━━━━━━━━━━━━━━━\n\n";

  usuario.historialGeneral.forEach((movimiento, indice) => {
    mensaje +=
      `${indice + 1}. ${movimiento.movimiento}\n` +
      `💳 Cuenta: ${movimiento.tipoDeCuenta}\n` +
      `💵 Monto: $${movimiento.monto}\n` +
      `🕒 ${movimiento.fecha.toLocaleString()}\n\n`;
  });

  alert(mensaje);
}

const usuarioCreado = crearNuevoUsuario();

if (usuarioCreado !== null) {
  iniciarMenu();
}

const cuentaNormal = [];
const cuentaAhorro = [];

let continuar = true;

while (continuar) {
  const opcionMenu = prompt(
    "🏦 BANCO APP\n" +
      "1. 💵 Depositar en cuenta Normal\n" +
      "2. 🐷 Depositar en cuenta Ahorro\n" +
      "3. 📋 Ver historial de depósitos\n" +
      "4. 🗑️ Eliminar un depósito\n" +
      "5. 🔎 Buscar un depósito por monto\n" +
      "6. 🚪 Salir",
  );

  switch (opcionMenu) {
    case "1":
      depositar(cuentaNormal, "Normal");
      break;
    case "2":
      depositar(cuentaAhorro, "Ahorro");
      break;
    case "3":
      verHistorial();
      break;
    case "4":
      eliminarDeposito();
      break;
    case "5":
      buscarDeposito();
      break;
    case "6":
      continuar = false;
      alert("✅ Gracias por usar el banco app. ¡Hasta luego! 👋");
      break;
    default:
      alert("⚠️ Opción no válida, intenta de nuevo.");
  }
}

function depositar(cuentaDestino, nombreCuenta) {
  let montoDeposito = parseFloat(
    prompt(`💰 ¿Cuánto quieres depositar en tu cuenta ${nombreCuenta}?`),
  );

  while (isNaN(montoDeposito) || montoDeposito <= 0) {
    montoDeposito = parseFloat(
      prompt("❌ Ingresa un monto válido mayor a $0:"),
    );
  }

  cuentaDestino.push(montoDeposito);

  alert(
    `✅ Depósito de $${montoDeposito} realizado en cuenta ${nombreCuenta}.`,
  );
}

function construirTextoCuenta(cuentaConsultada, nombreCuenta) {
  let textoCuenta = `📁 --- Cuenta ${nombreCuenta} ---\n`;

  if (cuentaConsultada.length === 0) {
    textoCuenta += "📭 No hay depósitos registrados.\n";
    return textoCuenta;
  }

  let numeroDeposito = 1;
  for (const monto of cuentaConsultada) {
    textoCuenta += `${numeroDeposito}) $${monto}\n`;
    numeroDeposito++;
  }

  return textoCuenta;
}

function verHistorial() {
  let mensajeHistorial = "";
  mensajeHistorial += construirTextoCuenta(cuentaNormal, "Normal");
  mensajeHistorial += "\n";
  mensajeHistorial += construirTextoCuenta(cuentaAhorro, "Ahorro");

  console.log(mensajeHistorial);
  alert(mensajeHistorial);
}

function eliminarDeposito() {
  let cuentaElegida = prompt(
    "🗑️ ¿De qué cuenta quieres eliminar un depósito?\n1. Normal\n2. Ahorro",
  );

  while (cuentaElegida !== "1" && cuentaElegida !== "2") {
    cuentaElegida = prompt(
      "❌ Opción no válida. Escribe 1 para la cuenta Normal o 2 para la cuenta Ahorro:",
    );
  }

  const cuentaDestino = cuentaElegida === "1" ? cuentaNormal : cuentaAhorro;
  const nombreCuenta = cuentaElegida === "1" ? "Normal" : "Ahorro";

  if (cuentaDestino.length === 0) {
    alert(`📭 No hay depósitos en la cuenta ${nombreCuenta} para eliminar.`);
    return;
  }

  const opcionEliminar = prompt(
    "🗑️ ¿Cuál depósito quieres eliminar?\n" +
      "1. ⏮️ El primero\n" +
      "2. ⏭️ El último\n" +
      "3. 🔢 Uno específico (por número de depósito)",
  );

  switch (opcionEliminar) {
    case "1": {
      const montoEliminado = cuentaDestino.shift();
      alert(
        `Se eliminó el primer depósito: $${montoEliminado} de la cuenta ${nombreCuenta}.`,
      );
      break;
    }
    case "2": {
      const montoEliminado = cuentaDestino.pop();
      alert(
        `Se eliminó el último depósito: $${montoEliminado} de la cuenta ${nombreCuenta}.`,
      );
      break;
    }
    case "3": {
      let numeroDeposito = parseFloat(
        prompt(
          `¿Qué número de depósito quieres eliminar de la cuenta ${nombreCuenta}? (según el historial)`,
        ),
      );

      while (
        isNaN(numeroDeposito) ||
        numeroDeposito < 1 ||
        numeroDeposito > cuentaDestino.length
      ) {
        numeroDeposito = parseFloat(
          prompt(`❌ Ingresa un número entre 1 y ${cuentaDestino.length}:`),
        );
      }

      const posicionArray = numeroDeposito - 1;
      const montoEliminado = cuentaDestino[posicionArray];

      cuentaDestino.splice(posicionArray, 1);

      alert(
        `Se eliminó el depósito #${numeroDeposito} ($${montoEliminado}) de la cuenta ${nombreCuenta}.`,
      );
      break;
    }
    default:
      alert("Opción no válida.");
  }
}

function buscarDeposito() {
  let cuentaElegida = prompt(
    "🔎 ¿En qué cuenta quieres buscar?\n1. Normal\n2. Ahorro",
  );

  while (cuentaElegida !== "1" && cuentaElegida !== "2") {
    cuentaElegida = prompt("❌ Opción no válida. Escribe 1 o 2:");
  }

  const cuentaDestino = cuentaElegida === "1" ? cuentaNormal : cuentaAhorro;
  const nombreCuenta = cuentaElegida === "1" ? "Normal" : "Ahorro";

  const montoBuscado = parseFloat(
    prompt(`🔍 ¿Qué monto quieres buscar en la cuenta ${nombreCuenta}?`),
  );

  if (!cuentaDestino.includes(montoBuscado)) {
    alert(
      `❌ No hay ningún depósito de $${montoBuscado} en la cuenta ${nombreCuenta}.`,
    );
    return;
  }

  const posicionesEncontradas = [];

  let numeroDeposito = 1;
  for (const montoActual of cuentaDestino) {
    if (montoActual === montoBuscado) {
      posicionesEncontradas.push(numeroDeposito);
    }
    numeroDeposito++;
  }

  const textoVeces = posicionesEncontradas.length === 1 ? "vez" : "veces";

  let mensajeBusqueda = `✅ El depósito de $${montoBuscado} aparece ${posicionesEncontradas.length} ${textoVeces} en la cuenta ${nombreCuenta}.\n`;
  mensajeBusqueda += "📍 Posiciones en tu historial: ";

  for (const posicion of posicionesEncontradas) {
    mensajeBusqueda += `#${posicion} `;
  }

  alert(mensajeBusqueda);
}

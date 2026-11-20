export async function obtenerDatos(ruta) {
  const respuesta = await fetch(ruta);

  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar el archivo: ${ruta}`);
  }

  return await respuesta.json();
}

export function guardarUsuarios(usuarios) {
  localStorage.setItem("usuariosBanco", JSON.stringify(usuarios));
}

export function recuperarUsuarios() {
  const textoGuardado = localStorage.getItem("usuariosBanco");

  return JSON.parse(textoGuardado ?? "[]");
}

export function respaldarUsuariosDañados() {
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

export function validarUsuariosGuardados(datos) {
  if (!Array.isArray(datos)) {
    throw new Error("Los datos guardados no son un array.");
  }

  datos.forEach((usuario) => {
    if (
      !usuario ||
      typeof usuario !== "object" ||
      !Array.isArray(usuario.cuentas) ||
      !Array.isArray(usuario.historialGeneral)
    ) {
      throw new Error("La estructura del usuario no es válida.");
    }

    usuario.cuentas.forEach((cuenta) => {
      if (
        !cuenta ||
        typeof cuenta !== "object" ||
        !Array.isArray(cuenta.historial) ||
        !Number.isFinite(cuenta.saldo)
      ) {
        throw new Error("La estructura de una cuenta no es válida.");
      }

      cuenta.historial.forEach((movimiento) => {
        if (!movimiento || !Number.isFinite(movimiento.monto)) {
          throw new Error("Un movimiento bancario no es válido.");
        }

        if (
          typeof movimiento.fecha !== "string" ||
          Number.isNaN(Date.parse(movimiento.fecha))
        ) {
          throw new Error("La fecha de un movimiento no es válida.");
        }
      });
    });

    usuario.historialGeneral.forEach((movimiento) => {
      if (
        !movimiento ||
        !Number.isFinite(movimiento.monto) ||
        typeof movimiento.fecha !== "string" ||
        Number.isNaN(Date.parse(movimiento.fecha))
      ) {
        throw new Error("El historial general contiene datos inválidos.");
      }
    });
  });

  return true;
}

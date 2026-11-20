export class NuevoUsuario {
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

  depositar(idCuenta, monto, detalle = "") {
    if (monto > 0 && Number.isFinite(monto)) {
      const cuenta = this.cuentas.find(
        (cuenta) => cuenta.idCuenta === idCuenta,
      );

      if (cuenta) {
        cuenta.saldo += monto;

        cuenta.historial.push({
          movimiento: "Depósito",
          monto: monto,
          detalle: detalle,
          fecha: new Date(),
        });

        this.historialGeneral.push({
          movimiento: "Depósito",
          tipoDeCuenta: cuenta.tipoDeCuenta,
          monto: monto,
          detalle: detalle,
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

  retirar(idCuenta, monto, detalle = "") {
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
            detalle: detalle,
            fecha: new Date(),
          });

          this.historialGeneral.push({
            movimiento: "Retiro",
            tipoDeCuenta: cuenta.tipoDeCuenta,
            monto: monto,
            detalle: detalle,
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

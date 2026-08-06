const nombreUsuario = prompt("Ingrese su nombre:");
let mesesSuscripcion = Number(
  prompt(
    "Ingrese los meses que desea suscribirse a nuestro servicio (Precio mensual: $10)",
  ),
);
let precioTotal = mesesSuscripcion * 10;
let pagoParcial = Number(
  prompt(
    "Su total a pagar es: $" +
      precioTotal +
      ". Ingrese el monto que desea pagar momentáneamente:",
  ),
);
let saldoRestante = precioTotal - pagoParcial;

console.log(
  "Se registro una nueva suscripcion de: " +
    nombreUsuario +
    " se ha suscrito por " +
    mesesSuscripcion +
    " meses por un total de: $" +
    precioTotal +
    ". Pago parcial: $" +
    pagoParcial +
    ". Saldo restante por pagar: $" +
    saldoRestante,
);
alert(
  nombreUsuario +
    ", gracias por suscribirte por " +
    mesesSuscripcion +
    " meses. " +
    "Ha pagado $" +
    pagoParcial +
    ". Su saldo restante por pagar es: $" +
    saldoRestante,
);

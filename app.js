// ---------- 1. El secreto ----------
const secreto = Math.floor(Math.random() * 100) + 1;

// ---------- 2. Selección de elementos ----------
const entrada = document.querySelector("#entrada");
const boton = document.querySelector("#boton");
const pista = document.querySelector("#pista");
const marcador = document.querySelector("#marcador");

// ---------- 3. Contador ----------
let intentos = 0;

// ---------- 4. El evento ----------
boton.addEventListener("click", () => {
  const valor = Number(entrada.value);

  if (entrada.value.trim() === "" || Number.isNaN(valor) || valor < 1 || valor > 100) {
    pista.textContent = "Introduce un número válido entre 1 y 100.";
    return;
  }

  intentos++;
  marcador.textContent = `Intentos: ${intentos}`;

  if (valor < secreto) {
    pista.textContent = "El secreto es MAYOR.";
  } else if (valor > secreto) {
    pista.textContent = "El secreto es MENOR.";
  } else {
    pista.textContent = `¡Correcto! Has acertado en ${intentos} ${intentos === 1 ? "intento" : "intentos"}.`;
    boton.disabled = true;
    entrada.disabled = true;
  }

  entrada.value = "";
});
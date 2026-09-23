// ---------- 1. El secreto ----------
const secreto = Math.floor(Math.random() * 100) + 1;

// ---------- 2. Selección de elementos ----------
const intento = document.querySelector("#intento");
const probar = document.querySelector("#probar");
const pista = document.querySelector("#pista");
const marcador = document.querySelector("#marcador");
const respuesta = document.querySelector("#respuesta");

// ---------- 3. Contador ----------
let intentos = 0;

// ---------- 4. El evento ----------
probar.addEventListener("click", () => {
  const valor = Number(intento.value);

  // Mostrar el intento actual en el elemento #respuesta usando un template literal
  respuesta.textContent = `Has dicho: ${valor}`;

  if (intento.value.trim() === "" || Number.isNaN(valor) || valor < 1 || valor > 100) {
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
    probar.disabled = true;
    intento.disabled = true;
  }

  intento.value = "";
});
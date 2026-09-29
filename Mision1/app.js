const LINEAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
const RETARDO_MAQUINA = 500;
const TECLA_SECRETA = "n";

const tablero = document.querySelector("#tablero");
const estado = document.querySelector("#estado");
const marcador = document.querySelector("#marcador");
const botonReiniciar = document.querySelector("#reiniciar");
const botonModo = document.querySelector("#modo");

// Estado del juego: la fuente de verdad. El DOM solo lo refleja.
const casillas = Array(9).fill(null);
const puntos = { X: 0, O: 0, empates: 0 };
let turno = "X";
let partidaTerminada = false;
let contraMaquina = true;
let temporizadorMaquina = null;

function crearTablero() {
  for (let i = 0; i < casillas.length; i++) {
    const celda = document.createElement("button");
    celda.type = "button";
    celda.className = "celda";
    celda.dataset.indice = i;
    celda.setAttribute("aria-label", `Casilla ${i + 1}`);
    tablero.append(celda);
  }
  return [...tablero.children];
}

const celdas = crearTablero();

function nombreDe(ficha) {
  return contraMaquina && ficha === "O" ? "la máquina" : `el jugador ${ficha}`;
}

function actualizarEstado() {
  estado.textContent = `Turno de ${nombreDe(turno)} (${turno})`;
}

function actualizarMarcador() {
  marcador.textContent = `X: ${puntos.X} · O: ${puntos.O} · Empates: ${puntos.empates}`;
}

function actualizarBotonModo() {
  botonModo.textContent = contraMaquina ? "Modo: contra la máquina" : "Modo: dos jugadores";
}

function buscarLinea(ficha) {
  return LINEAS.find((linea) => linea.every((i) => casillas[i] === ficha)) ?? null;
}

function pintarCasilla(indice, ficha) {
  const celda = celdas[indice];
  celda.textContent = ficha;
  celda.classList.add(ficha.toLowerCase());
  celda.disabled = true;
}

function terminar(linea) {
  partidaTerminada = true;
  celdas.forEach((celda) => (celda.disabled = true));
  if (linea) {
    linea.forEach((i) => celdas[i].classList.add("ganadora"));
    puntos[turno]++;
    estado.textContent = ` ¡Gana ${nombreDe(turno)}!`;
  } else {
    puntos.empates++;
    estado.textContent = "Empate";
  }
  actualizarMarcador();
}

function jugar(indice) {
  if (partidaTerminada || casillas[indice] !== null) return;

  casillas[indice] = turno;
  pintarCasilla(indice, turno);

  const linea = buscarLinea(turno);
  if (linea) return terminar(linea);
  if (casillas.every((c) => c !== null)) return terminar(null);

  turno = turno === "X" ? "O" : "X";
  actualizarEstado();

  if (contraMaquina && turno === "O") {
    temporizadorMaquina = setTimeout(jugadaMaquina, RETARDO_MAQUINA);
  }
}

// Devuelve una casilla libre que haría ganar a `ficha`, o undefined.
function buscarJugadaGanadora(ficha, libres) {
  return libres.find((i) => {
    casillas[i] = ficha;
    const gana = buscarLinea(ficha) !== null;
    casillas[i] = null;
    return gana;
  });
}

function jugadaMaquina() {
  const libres = casillas.flatMap((c, i) => (c === null ? [i] : []));
  const aleatoria = libres[Math.floor(Math.random() * libres.length)];
  const centro = libres.includes(4) ? 4 : aleatoria;

  jugar(buscarJugadaGanadora("O", libres) ?? buscarJugadaGanadora("X", libres) ?? centro);
}

// Filtro para las jugadas del usuario: ni con la partida acabada ni en turno de la máquina.
function intentarJugar(indice) {
  const turnoDeLaMaquina = contraMaquina && turno === "O";
  if (partidaTerminada || turnoDeLaMaquina) return;
  jugar(indice);
}

function reiniciar() {
  clearTimeout(temporizadorMaquina);
  casillas.fill(null);
  turno = "X";
  partidaTerminada = false;
  celdas.forEach((celda) => {
    celda.textContent = "";
    celda.disabled = false;
    celda.className = "celda";
  });
  actualizarEstado();
}

function cambiarModo() {
  contraMaquina = !contraMaquina;
  puntos.X = 0;
  puntos.O = 0;
  puntos.empates = 0;
  actualizarBotonModo();
  actualizarMarcador();
  reiniciar();
}

// Un único listener en el tablero (delegación) en vez de nueve.
tablero.addEventListener("click", (evento) => {
  const celda = evento.target.closest(".celda");
  if (celda) intentarJugar(Number(celda.dataset.indice));
});

botonReiniciar.addEventListener("click", reiniciar);
botonModo.addEventListener("click", cambiarModo);

document.addEventListener("keydown", (evento) => {
  if (evento.key.toLowerCase() === TECLA_SECRETA) {
    document.body.classList.toggle("oscuro");
  } else if (/^[1-9]$/.test(evento.key)) {
    intentarJugar(Number(evento.key) - 1);
  }
});

actualizarBotonModo();
actualizarMarcador();
actualizarEstado();

const estado = document.querySelector("#estado");
const lista = document.querySelector("#lista");
const resumen = document.querySelector("#resumen");
const selectorClase = document.querySelector("#clase");

function crear(etiqueta, clase, texto = "") {
  const nodo = document.createElement(etiqueta);
  nodo.className = clase;
  nodo.textContent = texto;
  return nodo;
}

const colorValido = (color) => (/^#[0-9a-f]{6}$/i.test(color) ? color : "#b9eaff");

export function mostrarCarga() {
  estado.replaceChildren(crear("p", "carga", "⏳ Cargando brawlers…"));
  lista.replaceChildren();
  resumen.replaceChildren();
}

export function mostrarError(mensaje, alReintentar) {
  const boton = crear("button", "reintentar", "Reintentar");
  boton.addEventListener("click", alReintentar);
  estado.replaceChildren(crear("p", "error", `⚠️ ${mensaje}`), boton);
  lista.replaceChildren();
  resumen.replaceChildren();
}

export function mostrarVacio(mensaje) {
  estado.replaceChildren(crear("p", "vacio", mensaje));
}

export function limpiarEstado() {
  estado.replaceChildren();
}

export function pintarClases(clases) {
  const opciones = ["", ...clases].map((nombre) => {
    const opcion = crear("option", "", nombre || "Todas las clases");
    opcion.value = nombre;
    return opcion;
  });
  selectorClase.replaceChildren(...opciones);
}

export function pintarResumen({ total, gadgets, estrellas, claseTop }) {
  const datos = [
    [total, "brawlers"],
    [gadgets, "gadgets"],
    [estrellas, "habilidades estelares"],
    [claseTop, "clase más común"],
  ];
  resumen.replaceChildren(
    ...datos.map(([valor, etiqueta]) => {
      const caja = crear("div", "dato");
      caja.append(crear("strong", "", String(valor)), crear("span", "", etiqueta));
      return caja;
    }),
  );
}

// Prueba las imágenes de la API una a una; si todas fallan, muestra la inicial.
function crearImagen(b) {
  const candidatas = [...b.imagenes];
  if (!candidatas.length) return crear("div", "sin-imagen", b.nombre.charAt(0));

  const imagen = crear("img", "");
  imagen.alt = `Retrato de ${b.nombre}`;
  imagen.loading = "lazy";
  imagen.addEventListener("error", () => {
    candidatas.shift();
    if (candidatas.length) imagen.src = candidatas[0];
    else imagen.replaceWith(crear("div", "sin-imagen", b.nombre.charAt(0)));
  });
  imagen.src = candidatas[0];
  return imagen;
}

function crearLeerMas(b) {
  const texto = crear("p", "sinopsis", b.descripcion);
  texto.hidden = true;
  const boton = crear("button", "leer-mas", "Leer más");

  boton.addEventListener("click", () => {
    texto.hidden = !texto.hidden;
    boton.textContent = texto.hidden ? "Leer más" : "Leer menos";
  });
  return [texto, boton];
}

function crearTarjeta(b) {
  const tarjeta = crear("article", "tarjeta");
  tarjeta.style.setProperty("--rareza", colorValido(b.color));
  tarjeta.append(
    crearImagen(b),
    crear("h3", "", b.nombre),
    crear("p", "meta", `${b.rareza} · ${b.clase}`),
    crear("p", "nota", `⭐ ${b.estrellas} · 🔧 ${b.gadgets}`),
  );
  if (b.descripcion) tarjeta.append(...crearLeerMas(b));
  return tarjeta;
}

function crearGrupo(grupo) {
  const seccion = crear("section", "grupo");
  if (grupo.titulo) {
    const titulo = crear("h2", "titulo-grupo", `${grupo.titulo} (${grupo.brawlers.length})`);
    titulo.style.setProperty("--rareza", colorValido(grupo.color));
    seccion.append(titulo);
  }
  const rejilla = crear("div", "rejilla");
  rejilla.append(...grupo.brawlers.map((b) => crearTarjeta(b)));
  seccion.append(rejilla);
  return seccion;
}

export function pintarLista(grupos) {
  if (!grupos.length) {
    lista.replaceChildren();
    mostrarVacio("No hay brawlers que coincidan con tu búsqueda.");
    return;
  }
  limpiarEstado();
  lista.replaceChildren(...grupos.map((g) => crearGrupo(g)));
}

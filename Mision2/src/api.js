const URL_BRAWLERS = "https://api.brawlapi.com/v1/brawlers";
const CLAVE_CACHE = "brawl:brawlers";
const DURACION_CACHE_MS = 10 * 60 * 1000;

function leerCache() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CACHE));
    const vigente = guardado && Date.now() - guardado.fecha < DURACION_CACHE_MS;
    return vigente && Array.isArray(guardado.datos) ? guardado.datos : null;
  } catch {
    return null;
  }
}

function guardarCache(datos) {
  try {
    localStorage.setItem(CLAVE_CACHE, JSON.stringify({ fecha: Date.now(), datos }));
  } catch {
    // Si el almacenamiento está lleno o bloqueado, la app sigue sin caché.
  }
}

export async function obtenerBrawlers({ forzar = false } = {}) {
  if (!forzar) {
    const enCache = leerCache();
    if (enCache) return enCache;
  }

  let respuesta;
  try {
    respuesta = await fetch(URL_BRAWLERS);
  } catch {
    throw new Error("No se pudo conectar. Revisa tu conexión a internet.");
  }

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió con el error ${respuesta.status}.`);
  }

  const datos = await respuesta.json();
  // La API puede devolver la lista directa o dentro de una propiedad "list".
  const lista = Array.isArray(datos) ? datos : datos?.list;
  if (!Array.isArray(lista)) {
    throw new Error("La API devolvió datos con un formato inesperado.");
  }

  guardarCache(lista);
  return lista;
}

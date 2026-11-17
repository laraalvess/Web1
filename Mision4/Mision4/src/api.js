import { registroSchema } from "./schema.js";

const URL_API = "/api/inscripciones";

// Una sola función hace el fetch y convierte los fallos en errores con mensaje claro.
async function pedir(url, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }
  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    throw new Error(cuerpo.mensaje ?? `El servidor respondió con el error ${respuesta.status}.`);
  }
  return respuesta.json();
}

// Devuelve los registros válidos y cuántos se descartaron por tener datos corruptos.
export async function listarInscripciones(modo = "") {
  const datos = await pedir(modo ? `${URL_API}?modo=${encodeURIComponent(modo)}` : URL_API);
  if (!Array.isArray(datos)) throw new Error("La API devolvió un formato inesperado.");

  const resultados = datos.map((dato) => registroSchema.safeParse(dato));
  return {
    validos: resultados.filter((r) => r.success).map((r) => r.data),
    descartados: resultados.filter((r) => !r.success).length,
  };
}

export const crearInscripcion = (datos) =>
  pedir(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

// API de mentira para desarrollo: GET y POST en /api/inscripciones.
// Los datos viven en memoria: al reiniciar `npm run dev` vuelven a los iniciales.
const registros = [
  { id: 1, jugador: "SpikeFan", email: "spike@example.com", edad: 15, tag: "#2PP", modo: "Atrapagemas" },
  { id: 2, jugador: "ColtPro", email: "colt@example.com", edad: 17, tag: "#8QV0", modo: "Robo" },
  // Registro corrupto a propósito: demuestra que Zod lo atrapa al validar la respuesta.
  { id: 3, jugador: "", email: "no-es-un-email", edad: "abc", tag: "#X", modo: "Robo" },
];
let siguienteId = 4;
const RETARDO_MS = 600;

function responder(res, estado, cuerpo) {
  setTimeout(() => {
    res.statusCode = estado;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(cuerpo));
  }, RETARDO_MS);
}

function manejar(req, res) {
  if (req.method === "GET") {
    const modo = new URL(req.url, "http://localhost").searchParams.get("modo");
    return responder(res, 200, modo ? registros.filter((r) => r.modo === modo) : registros);
  }
  if (req.method === "POST") {
    let texto = "";
    req.on("data", (trozo) => (texto += trozo));
    req.on("end", () => {
      try {
        const { jugador, email, edad, tag, modo } = JSON.parse(texto);
        if (registros.some((r) => r.email === email)) {
          return responder(res, 409, { mensaje: "Ese email ya está inscrito." });
        }
        const nuevo = { id: siguienteId++, jugador, email, edad, tag, modo };
        registros.push(nuevo);
        responder(res, 201, nuevo);
      } catch {
        responder(res, 400, { mensaje: "Los datos enviados no son válidos." });
      }
    });
    return;
  }
  responder(res, 405, { mensaje: "Método no permitido." });
}

export function apiFalsa() {
  return {
    name: "api-falsa",
    // Con llaves y sin `return`: si devolvieran algo, Vite lo trataría como un «post hook».
    configureServer(servidor) {
      servidor.middlewares.use("/api/inscripciones", manejar);
    },
    configurePreviewServer(servidor) {
      servidor.middlewares.use("/api/inscripciones", manejar);
    },
  };
}

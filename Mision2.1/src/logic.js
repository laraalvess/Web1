// Aparecen en los datos del juego, pero no están disponibles en la app oficial.
const EXCLUIDOS = ["vince", "lightyear"];

// Nombre de cada rareza en español: [singular, plural].
const RAREZAS = {
  "Trophy Road": ["Camino de trofeos", "Camino de trofeos"],
  Common: ["Común", "Comunes"],
  Rare: ["Especial", "Especiales"],
  "Super Rare": ["Superespecial", "Superespeciales"],
  Epic: ["Épico", "Épicos"],
  Mythic: ["Mítico", "Míticos"],
  Legendary: ["Legendario", "Legendarios"],
};

// Rareza y clase pueden venir como objeto {name} o como texto: se unifica aquí.
const nombreDe = (valor) => (typeof valor === "string" ? valor : valor?.name) || "Desconocida";

function normalizar(brawler) {
  const rareza = nombreDe(brawler.rarity);
  const [singular, plural] = RAREZAS[rareza] ?? [rareza, rareza];
  return {
    id: brawler.id,
    nombre: brawler.name,
    rareza: singular,
    rarezaPlural: plural,
    rarezaId: brawler.rarity?.id ?? 0,
    color: brawler.rarity?.color ?? "",
    clase: nombreDe(brawler.class),
    imagenes: [brawler.imageUrl, brawler.imageUrl2, brawler.imageUrl3].filter(Boolean),
    descripcion: brawler.description ?? "",
    estrellas: brawler.starPowers?.length ?? 0,
    gadgets: brawler.gadgets?.length ?? 0,
  };
}

const estaDisponible = (b) =>
  b?.id && b?.name && b.released !== false &&
  !EXCLUIDOS.some((excluido) => b.name.toLowerCase().includes(excluido));

export const normalizarTodos = (datos) => datos.filter(estaDisponible).map(normalizar);

export const clasesUnicas = (brawlers) =>
  [...new Set(brawlers.map((b) => b.clase))].toSorted();

export function filtrar(brawlers, { texto, clase }) {
  const buscado = texto.trim().toLowerCase();
  return brawlers.filter(
    (b) => (!clase || b.clase === clase) && b.nombre.toLowerCase().includes(buscado),
  );
}

export const ordenarPorNombre = (brawlers) =>
  brawlers.toSorted((a, b) => a.nombre.localeCompare(b.nombre));

// Con modo "rareza" devuelve un grupo por rareza (de la más común a la más rara).
export function agrupar(brawlers, modo) {
  if (modo !== "rareza") {
    return brawlers.length ? [{ id: 0, titulo: "", color: "", brawlers }] : [];
  }
  const grupos = brawlers.reduce((mapa, b) => {
    const grupo = mapa.get(b.rarezaId) ?? {
      id: b.rarezaId, titulo: b.rarezaPlural, color: b.color, brawlers: [],
    };
    grupo.brawlers.push(b);
    return mapa.set(b.rarezaId, grupo);
  }, new Map());
  return [...grupos.values()].toSorted((a, b) => a.id - b.id);
}

export function calcularResumen(brawlers) {
  const { gadgets, estrellas, porClase } = brawlers.reduce(
    (acc, b) => ({
      gadgets: acc.gadgets + b.gadgets,
      estrellas: acc.estrellas + b.estrellas,
      porClase: { ...acc.porClase, [b.clase]: (acc.porClase[b.clase] ?? 0) + 1 },
    }),
    { gadgets: 0, estrellas: 0, porClase: {} },
  );
  const [claseTop] = Object.entries(porClase).toSorted((a, b) => b[1] - a[1])[0] ?? [];

  return { total: brawlers.length, gadgets, estrellas, claseTop: claseTop ?? "—" };
}

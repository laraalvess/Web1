import BrawlerImage from "./BrawlerImage.jsx";
import ReadMore from "./ReadMore.jsx";
import { colorValido } from "../logic.js";

export default function BrawlerCard({ brawler, esFavorito, onFavorito }) {
  const { id, nombre, rareza, clase, estrellas, gadgets, imagenes, descripcion, color } = brawler;

  return (
    <article className="tarjeta" style={{ "--rareza": colorValido(color) }}>
      <button
        type="button"
        className={`corazon ${esFavorito ? "activo" : ""}`}
        aria-pressed={esFavorito}
        aria-label={esFavorito ? `Quitar a ${nombre} de favoritos` : `Añadir a ${nombre} a favoritos`}
        onClick={() => onFavorito(id)}
      >
        {esFavorito ? "♥" : "♡"}
      </button>
      <BrawlerImage imagenes={imagenes} nombre={nombre} />
      <h3>{nombre}</h3>
      <p className="meta">{rareza} · {clase}</p>
      <p className="nota">⭐ {estrellas} · 🔧 {gadgets}</p>
      {descripcion && <ReadMore texto={descripcion} />}
    </article>
  );
}

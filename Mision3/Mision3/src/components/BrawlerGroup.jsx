import BrawlerCard from "./BrawlerCard.jsx";
import { colorValido } from "../logic.js";

export default function BrawlerGroup({ grupo, favoritos, onFavorito }) {
  return (
    <section className="grupo">
      {grupo.titulo && (
        <h2 className="titulo-grupo" style={{ "--rareza": colorValido(grupo.color) }}>
          {grupo.titulo} ({grupo.brawlers.length})
        </h2>
      )}
      <div className="rejilla">
        {grupo.brawlers.map((b) => (
          <BrawlerCard
            key={b.id}
            brawler={b}
            esFavorito={favoritos.has(b.id)}
            onFavorito={onFavorito}
          />
        ))}
      </div>
    </section>
  );
}

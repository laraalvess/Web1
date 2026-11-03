import { useEffect, useRef } from "react";
import BrawlerImage from "./BrawlerImage.jsx";
import { colorValido } from "../logic.js";

// Ficha ampliada. App solo la monta cuando hay un brawler destacado,
// así que los efectos de abajo se activan al abrirla y se limpian al cerrarla.
export default function BrawlerModal({ brawler, esFavorito, onFavorito, onOtro, onCerrar }) {
  const botonCerrar = useRef(null);

  // Efecto 1: escuchar Escape y bloquear el scroll de la página mientras está abierta.
  // El cleanup quita el listener y restaura el scroll (si no, se acumularían listeners).
  useEffect(() => {
    const alPulsar = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    const overflowPrevio = document.body.style.overflow;
    document.addEventListener("keydown", alPulsar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onCerrar]);

  // Efecto 2: llevar el foco al botón de cerrar al abrir (accesibilidad con teclado).
  useEffect(() => {
    botonCerrar.current?.focus();
  }, []);

  const { id, nombre, rareza, clase, estrellas, gadgets, imagenes, descripcion, color } = brawler;

  return (
    // Cerrar solo si se hace clic en el fondo, no dentro de la ficha.
    <div className="modal-fondo" onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Ficha de ${nombre}`}
        style={{ "--rareza": colorValido(color) }}
      >
        <BrawlerImage imagenes={imagenes} nombre={nombre} />
        <h2>{nombre}</h2>
        <p className="meta">{rareza} · {clase}</p>
        <p className="nota">⭐ {estrellas} habilidades estelares · 🔧 {gadgets} gadgets</p>
        {descripcion ? <p className="sinopsis">{descripcion}</p> : <p className="sinopsis">Sin descripción.</p>}
        <div className="acciones">
          <button type="button" onClick={() => onFavorito(id)} aria-pressed={esFavorito}>
            {esFavorito ? "♥ En favoritos" : "♡ Favorito"}
          </button>
          <button type="button" onClick={onOtro}>🎲 Otro</button>
          <button type="button" className="leer-mas" ref={botonCerrar} onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

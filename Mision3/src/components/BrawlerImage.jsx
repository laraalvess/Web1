import { useState } from "react";

// Prueba las imágenes de la API una a una; si todas fallan, muestra la inicial.
export default function BrawlerImage({ imagenes, nombre }) {
  const [fallidas, setFallidas] = useState(0);
  const src = imagenes[fallidas];

  if (!src) return <div className="sin-imagen">{nombre.charAt(0)}</div>;

  return (
    <img
      src={src}
      alt={`Retrato de ${nombre}`}
      loading="lazy"
      onError={() => setFallidas((n) => n + 1)}
    />
  );
}

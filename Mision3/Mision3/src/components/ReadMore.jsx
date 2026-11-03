import { useState } from "react";

// El «abierto/cerrado» solo le importa a este bloque, así que su estado es local.
export default function ReadMore({ texto }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {abierto && <p className="sinopsis">{texto}</p>}
      <button
        type="button"
        className="leer-mas"
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
      >
        {abierto ? "Leer menos" : "Leer más"}
      </button>
    </>
  );
}

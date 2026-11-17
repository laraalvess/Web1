import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listarInscripciones } from "../api.js";
import { MODOS } from "../schema.js";

export default function ListaInscripciones() {
  const [modo, setModo] = useState("");

  // La clave incluye el filtro: cada modo tiene su propia caché, y la invalidación
  // de ["inscripciones"] (tras crear una inscripción) las cubre todas.
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["inscripciones", { modo }],
    queryFn: () => listarInscripciones(modo),
    placeholderData: keepPreviousData,
  });

  let contenido;
  if (isPending) {
    contenido = <p className="estado">⏳ Cargando inscripciones…</p>;
  } else if (isError) {
    contenido = (
      <div className="estado">
        <p className="error">⚠️ {error.message}</p>
        <button type="button" onClick={() => refetch()}>Reintentar</button>
      </div>
    );
  } else if (!data.validos.length) {
    contenido = <p className="estado">Todavía no hay inscripciones{modo && ` en ${modo}`}.</p>;
  } else {
    contenido = (
      <ul className="lista">
        {data.validos.map((r) => (
          <li key={r.id}>
            <strong>{r.jugador}</strong> <span>{r.tag}</span>
            <small>{r.modo} · {r.edad} años</small>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="panel" aria-busy={isFetching}>
      <h2>Inscritos</h2>
      <label>
        Filtrar por modo{" "}
        <select value={modo} onChange={(e) => setModo(e.target.value)}>
          <option value="">Todos</option>
          {MODOS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      {contenido}
      {data?.descartados > 0 && (
        <p className="aviso">
          ⚠️ Se descartaron {data.descartados} registro(s) del servidor por tener datos corruptos.
        </p>
      )}
    </section>
  );
}

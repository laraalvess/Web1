import { useCallback, useMemo, useState } from "react";
import { useFetch } from "./hooks/useFetch.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import {
  normalizarTodos, clasesUnicas, filtrar, ordenarPorNombre, agrupar, calcularResumen,
} from "./logic.js";
import Header from "./components/Header.jsx";
import Controls from "./components/Controls.jsx";
import Summary from "./components/Summary.jsx";
import StatusMessage from "./components/StatusMessage.jsx";
import BrawlerGroup from "./components/BrawlerGroup.jsx";
import BrawlerModal from "./components/BrawlerModal.jsx";

const URL_BRAWLERS = "https://api.brawlapi.com/v1/brawlers";
const DIEZ_MINUTOS = 10 * 60 * 1000;

export default function App() {
  // --- Datos remotos ---
  const { data, loading, error, reload } = useFetch(URL_BRAWLERS, {
    cacheKey: "brawl:brawlers",
    cacheMs: DIEZ_MINUTOS,
  });

  // --- Estado mínimo: solo lo que el usuario puede cambiar ---
  const [texto, setTexto] = useState("");
  const [clase, setClase] = useState("");
  const [orden, setOrden] = useLocalStorage("brawl:orden", "rareza");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [idsFavoritos, setIdsFavoritos] = useLocalStorage("brawl:favoritos", []);
  const [destacadoId, setDestacadoId] = useState(null);

  // --- Todo lo demás se DERIVA del estado (nada de duplicarlo ni de useEffect) ---
  const brawlers = useMemo(() => (data ? normalizarTodos(data) : []), [data]);
  const clases = useMemo(() => clasesUnicas(brawlers), [brawlers]);
  const favoritos = useMemo(() => new Set(idsFavoritos), [idsFavoritos]);

  const visibles = useMemo(
    () =>
      ordenarPorNombre(
        filtrar(brawlers, { texto, clase, soloIds: soloFavoritos ? idsFavoritos : null }),
      ),
    [brawlers, texto, clase, soloFavoritos, idsFavoritos],
  );
  const grupos = agrupar(visibles, orden);
  const resumen = calcularResumen(visibles);
  const destacado = brawlers.find((b) => b.id === destacadoId) ?? null;

  // --- Eventos ---
  const alternarFavorito = useCallback(
    (id) =>
      setIdsFavoritos((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])),
    [setIdsFavoritos],
  );

  // Estable (deps vacías) porque el efecto del modal depende de ella.
  const cerrarFicha = useCallback(() => setDestacadoId(null), []);

  function sorprender() {
    const candidatos = visibles.filter((b) => b.id !== destacadoId);
    if (!candidatos.length) return;
    setDestacadoId(candidatos[Math.floor(Math.random() * candidatos.length)].id);
  }

  // --- Qué se muestra según el estado de la carga y de los filtros ---
  let contenido;
  if (loading) {
    contenido = <StatusMessage tipo="carga" mensaje="⏳ Cargando brawlers…" />;
  } else if (error) {
    contenido = <StatusMessage tipo="error" mensaje={error} onReintentar={reload} />;
  } else if (!brawlers.length) {
    contenido = <StatusMessage tipo="vacio" mensaje="La API no devolvió ningún brawler." />;
  } else {
    contenido = (
      <>
        <Summary {...resumen} />
        {visibles.length ? (
          grupos.map((g) => (
            <BrawlerGroup key={g.id} grupo={g} favoritos={favoritos} onFavorito={alternarFavorito} />
          ))
        ) : (
          <StatusMessage
            tipo="vacio"
            mensaje={
              soloFavoritos && !idsFavoritos.length
                ? "Aún no tienes favoritos: pulsa el ♡ de una tarjeta."
                : "No hay brawlers que coincidan con tu búsqueda."
            }
          />
        )}
      </>
    );
  }

  return (
    <main className="app">
      <Header />
      <Controls
        texto={texto} onTexto={setTexto}
        clase={clase} onClase={setClase} clases={clases}
        orden={orden} onOrden={setOrden}
        soloFavoritos={soloFavoritos} onSoloFavoritos={setSoloFavoritos}
        totalFavoritos={idsFavoritos.length}
        onSorprender={sorprender}
        puedeSorprender={visibles.length > 0}
      />
      {contenido}
      {destacado && (
        <BrawlerModal
          brawler={destacado}
          esFavorito={favoritos.has(destacado.id)}
          onFavorito={alternarFavorito}
          onOtro={sorprender}
          onCerrar={cerrarFicha}
        />
      )}
    </main>
  );
}

import { useCallback, useEffect, useState } from "react";

function leerCache(clave, duracionMs) {
  if (!clave) return null;
  try {
    const guardado = JSON.parse(localStorage.getItem(clave));
    const vigente = guardado && Date.now() - guardado.fecha < duracionMs;
    return vigente ? guardado.datos : null;
  } catch {
    return null;
  }
}

function guardarCache(clave, datos) {
  if (!clave) return;
  try {
    localStorage.setItem(clave, JSON.stringify({ fecha: Date.now(), datos }));
  } catch {
    // Sin caché si el almacenamiento está lleno o bloqueado.
  }
}

// Pide una URL y devuelve { data, loading, error, reload }.
// Opcional: cacheKey + cacheMs guardan la respuesta en localStorage ese tiempo.
export function useFetch(url, { cacheKey = "", cacheMs = 0 } = {}) {
  const [estado, setEstado] = useState({ data: null, loading: true, error: "" });
  // Cada «Reintentar» incrementa el contador, lo que vuelve a lanzar el efecto.
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // En el primer intento se acepta la caché; al reintentar se fuerza la red.
    const enCache = intento === 0 ? leerCache(cacheKey, cacheMs) : null;
    if (enCache) {
      setEstado({ data: enCache, loading: false, error: "" });
      return;
    }

    // Cleanup: si el componente se desmonta o cambia la URL, se cancela la petición
    // y así nunca se actualiza el estado con una respuesta que ya no interesa.
    const controlador = new AbortController();
    setEstado({ data: null, loading: true, error: "" });

    fetch(url, { signal: controlador.signal })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`El servidor respondió con el error ${respuesta.status}.`);
        }
        return respuesta.json();
      })
      .then((data) => {
        guardarCache(cacheKey, data);
        setEstado({ data, loading: false, error: "" });
      })
      .catch((fallo) => {
        if (fallo.name === "AbortError") return; // cancelada a propósito: no es un error
        const error =
          fallo instanceof TypeError
            ? "No se pudo conectar. Revisa tu conexión a internet."
            : fallo.message;
        setEstado({ data: null, loading: false, error });
      });

    return () => controlador.abort();
  }, [url, cacheKey, cacheMs, intento]);

  const reload = useCallback(() => setIntento((n) => n + 1), []);

  return { ...estado, reload };
}

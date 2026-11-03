import { useEffect, useState } from "react";

// Como useState, pero el valor sobrevive a recargar la página.
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado === null ? valorInicial : JSON.parse(guardado);
    } catch {
      return valorInicial; // JSON corrupto o almacenamiento bloqueado
    }
  });

  // Efecto: sincroniza con un sistema externo (localStorage) cada vez que cambia el valor.
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Si el almacenamiento está lleno o bloqueado, la app sigue funcionando sin guardar.
    }
  }, [clave, valor]);

  return [valor, setValor];
}

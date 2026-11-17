// tipo: "carga" | "error" | "vacio". Solo el error ofrece botón de reintentar.
export default function StatusMessage({ tipo, mensaje, onReintentar }) {
  return (
    <section className="estado" aria-live="polite">
      <p className={tipo}>{tipo === "error" ? `⚠️ ${mensaje}` : mensaje}</p>
      {tipo === "error" && onReintentar && (
        <button type="button" className="reintentar" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </section>
  );
}

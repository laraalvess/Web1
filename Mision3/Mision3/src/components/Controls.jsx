// Componente controlado: no guarda estado propio, todo vive en App (lifting state up).
export default function Controls({
  texto, onTexto,
  clase, onClase, clases,
  orden, onOrden,
  soloFavoritos, onSoloFavoritos, totalFavoritos,
  onSorprender, puedeSorprender,
}) {
  return (
    <section className="controles">
      <input
        type="search"
        placeholder="Buscar brawler…"
        value={texto}
        onChange={(e) => onTexto(e.target.value)}
      />
      <select aria-label="Clase" value={clase} onChange={(e) => onClase(e.target.value)}>
        <option value="">Todas las clases</option>
        {clases.map((nombre) => (
          <option key={nombre} value={nombre}>{nombre}</option>
        ))}
      </select>
      <select aria-label="Organizar por" value={orden} onChange={(e) => onOrden(e.target.value)}>
        <option value="rareza">Agrupar por rareza</option>
        <option value="nombre">Nombre (A-Z)</option>
      </select>
      <label className="check">
        <input
          type="checkbox"
          checked={soloFavoritos}
          onChange={(e) => onSoloFavoritos(e.target.checked)}
        />
        Solo favoritos ({totalFavoritos})
      </label>
      <button type="button" onClick={onSorprender} disabled={!puedeSorprender}>
        🎲 Sorpréndeme
      </button>
    </section>
  );
}

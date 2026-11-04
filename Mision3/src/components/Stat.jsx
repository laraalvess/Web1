export default function Stat({ valor, etiqueta }) {
  return (
    <div className="dato">
      <strong>{valor}</strong>
      <span>{etiqueta}</span>
    </div>
  );
}

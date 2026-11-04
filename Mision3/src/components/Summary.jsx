import Stat from "./Stat.jsx";

export default function Summary({ total, gadgets, estrellas, claseTop }) {
  return (
    <section className="resumen">
      <Stat valor={total} etiqueta="brawlers" />
      <Stat valor={gadgets} etiqueta="gadgets" />
      <Stat valor={estrellas} etiqueta="habilidades estelares" />
      <Stat valor={claseTop} etiqueta="clase más común" />
    </section>
  );
}

import FormularioInscripcion from "./components/FormularioInscripcion.jsx";
import ListaInscripciones from "./components/ListaInscripciones.jsx";

export default function App() {
  return (
    <main className="app">
      <header>
        <h1>Torneo Brawl</h1>
        <p>Inscríbete y mira quién más va a jugar.</p>
      </header>
      <div className="columnas">
        <FormularioInscripcion />
        <ListaInscripciones />
      </div>
    </main>
  );
}

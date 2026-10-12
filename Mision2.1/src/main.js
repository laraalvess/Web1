import "./style.css";
import { obtenerBrawlers } from "./api.js";
import {
  normalizarTodos, clasesUnicas, filtrar, ordenarPorNombre, agrupar, calcularResumen,
} from "./logic.js";
import {
  mostrarCarga, mostrarError, mostrarVacio, pintarClases, pintarResumen, pintarLista,
} from "./render.js";

const busqueda = document.querySelector("#busqueda");
const selectorClase = document.querySelector("#clase");
const selectorOrden = document.querySelector("#orden");

let brawlers = [];


function actualizar() {
  const visibles = ordenarPorNombre(
    filtrar(brawlers, { texto: busqueda.value, clase: selectorClase.value }),
  );
  pintarResumen(calcularResumen(visibles));
  pintarLista(agrupar(visibles, selectorOrden.value));
}

async function cargar(forzar = false) {
  mostrarCarga();
  try {
    brawlers = normalizarTodos(await obtenerBrawlers({ forzar }));
    if (!brawlers.length) {
      mostrarVacio("La API no devolvió ningún brawler.");
      return;
    }
    pintarClases(clasesUnicas(brawlers));
    actualizar();
  } catch (error) {
    mostrarError(error.message, () => cargar(true));
  }
}

busqueda.addEventListener("input", actualizar);
selectorClase.addEventListener("change", actualizar);
selectorOrden.addEventListener("change", actualizar);

cargar();

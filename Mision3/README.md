# Brawl Dex · React

Misión M3 · Reactor Core — Web Development I.

Es mi app de la Misión 2 (Brawl Dex) reconstruida en **React 19**. Consume la API pública BrawlAPI (`https://api.brawlapi.com/v1/brawlers`) y muestra todos los brawlers de Brawl Stars con buscador, filtro por clase, agrupación por rareza, resumen con estadísticas y descripciones con «Leer más».

**Novedades respecto a la M2:**
- **Favoritos**: cada tarjeta tiene un corazón; se guardan en `localStorage` y hay un filtro «Solo favoritos».
- **Sorpréndeme**: abre una ficha ampliada de un brawler al azar (respetando los filtros activos), con botón «Otro». Se cierra con Escape, enter, espacio, con un clic fuera o con el botón.
- La forma de ordenar se recuerda al recargar la página.

## Cómo arrancarlo
Requisito: Node.js 20.19 o superior (lo pide Vite 7).

```
npm install
npm run dev
```
Abre http://localhost:5173. Para ver el estado de error, desconecta internet (o la red en DevTools) y recarga: aparece el mensaje con el botón «Reintentar».

## Estructura
```
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx            # monta <App /> en #root
    ├── App.jsx             # ÚNICO sitio con el estado compartido; deriva todo lo demás
    ├── logic.js            # funciones puras (filtrar, agrupar, resumir…), sin React
    ├── style.css
    ├── hooks/
    │   ├── useFetch.js         # fetch + estados + cancelación + caché
    │   └── useLocalStorage.js  # useState que persiste en localStorage
    └── components/
        ├── Header, Controls, Summary, Stat, StatusMessage
        ├── BrawlerGroup, BrawlerCard, BrawlerImage, ReadMore
        └── BrawlerModal
```

## Decisiones de diseño
- **Estado mínimo en `App`**: solo guardo lo que el usuario cambia (texto, clase, orden, solo-favoritos, ids favoritos, id destacado). La lista filtrada, los grupos, el resumen y el brawler destacado se **derivan** en cada render (con `useMemo` donde compensa).
- **Lifting state**: `Controls` es un componente controlado (recibe valor y callback) y los favoritos viven en `App` porque los usan las tarjetas, el contador, el filtro y el modal.
- **Estado local donde solo importa localmente**: `ReadMore` (abierto/cerrado) y `BrawlerImage` (qué imagen falló).
- **`useEffect` solo para hablar con el exterior**: red (`useFetch`), `localStorage` (`useLocalStorage`) y listeners/scroll del navegador (`BrawlerModal`). Todos con dependencias completas y *cleanup*.
- **Bonus**: dos custom hooks reutilizables, `useFetch` y `useLocalStorage`.
- **`logic.js`** son las funciones puras de la M2, que no necesitaron cambiar al pasar a React.

## Uso de IA
He usado Claude (claude.ai) para ayudarme con este proyecto.

**Qué hizo Claude:** a partir de mi proyecto de la M2 me generó la primera versión de la migración a React: la división en componentes, los dos hooks (`useFetch`, `useLocalStorage`), `App.jsx` y los estilos nuevos. También me propuso la idea de los favoritos y del botón «Sorpréndeme».

**Prompt real:** *«Tengo que hacer este trabajo, ayúdame a hacerlo basándote en el enunciado y lo hacemos juntos por si no entiendo algo.»* (adjuntando el enunciado).

**Cómo lo verifiqué:**  ejecuté el proyecto en mi ordenador con npm run dev y fui probando cada función a mano: el buscador, el filtro por clase, el cambio de orden, «Leer más», marcar favoritos y recargar la página para ver que se mantienen, el botón «Sorpréndeme» (cerrando la ficha con Escape, con clic fuera y con el botón), y el error de red poniendo el navegador en Offline y pulsando «Reintentar». También ejecuté npm run build para comprobar que compila sin errores y revisé la consola del navegador (F12) para ver que no hubiera errores. Además leí el código de cada componente y de los hooks para poder explicar qué hace cada parte.

**Qué escribí/cambié yo a mano:** modifiqué el botón «Sorpréndeme» a mi gusto y retoqué código del proyecto por mi cuenta, probando cada cambio en el navegador hasta que funcionó bien. Revisé el código de los componentes y de los hooks para entender qué hace cada parte y poder explicarlo. Me encargué de organizar la carpeta del proyecto, instalar las dependencias con npm install, arrancarlo con npm run dev y resolver los problemas que fueron saliendo, como un error de package.json por tener la carpeta del proyecto anidada dentro de otra. Comprobé que compila con npm run build y revisé la consola del navegador para ver que no hubiera errores. Escribí a mano el README en lo que se refiere a mis cambios y a mi uso de IA.

## Autopsia
1. **Los favoritos son una lista de ids (`useLocalStorage`) y `esFavorito` se calcula al pintar.**
   Descarté añadir un campo `favorito: true/false` a cada brawler dentro del estado. Eso duplicaría información: habría dos copias de los brawlers (la de la API y la modificada) que sincronizar, y marcar un favorito obligaría a recrear todo el array. Con una lista de ids solo hay una fuente de verdad y el resto se deriva. El coste: `filtrar` hace `includes` sobre un array (para ~107 brawlers es irrelevante) y en `App` creo un `Set` para consultar rápido en las tarjetas.

2. **El filtrado y la agrupación se calculan durante el render (`useMemo`), no en un `useEffect` que guarde el resultado en otro `useState`.**
   Descarté el patrón «efecto + estado `visibles`»: obliga a un render extra cada vez que cambia un filtro, el resultado puede quedar desfasado un instante respecto a los filtros y es un estado más que mantener. Al derivarlo, la UI siempre está sincronizada con el estado. El coste: se recalcula cuando cambia cualquiera de sus dependencias (con 107 elementos es instantáneo) y hay que acordarse de listar bien las dependencias del `useMemo`.

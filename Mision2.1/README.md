# Brawl Dex

Misión M2 · Async Odyssey — Web Development I.

Aplicación hecha con Vite y JavaScript puro que consume la API pública BrawlAPI (de Brawlify) (`https://api.brawlapi.com/v1/brawlers`) y muestra todos los brawlers de Brawl Stars con buscador, filtro por clase, ordenación y un resumen con estadísticas.

## Cómo probarlo
```
npm install
npm run dev
```
Abre http://localhost:5173. Para ver el estado de error, desconecta internet (o la red en DevTools) y recarga: aparece el mensaje con el botón «Reintentar».

## Estructura
- `src/api.js`: `fetch` + `async/await`, comprobación de `response.ok` y caché en `localStorage` (10 min).
- `src/logic.js`: limpieza de datos y `filter` / `map` / `reduce` / `toSorted`, sin tocar el DOM.
- `src/traduccion.js`: traduce las descripciones al español con la API de MyMemory (bajo demanda, en trozos con `Promise.all`) y las guarda en `localStorage`.
- `src/render.js`: crea y pinta los nodos del DOM (carga, error, vacío, tarjetas).
- `src/main.js`: conecta todo y gestiona los eventos.

## Uso de IA
[ADAPTA ESTO A LO QUE HICISTE DE VERDAD.] Usé Claude (chat) para generar la primera versión del proyecto a partir del enunciado de la misión; el prompt fue: "[pega aquí el que usaste]". Después [explica qué revisaste: probar el modo sin internet, vaciar la caché en DevTools > Application, probar un director sin resultados…] y [qué cambiaste tú a mano, o di que no cambiaste nada].

## Autopsia
[REESCRIBE ESTAS DECISIONES CON TUS PALABRAS Y QUITA LA QUE NO PUEDAS EXPLICAR.]
1. Normalizo los datos una sola vez, al llegar (`normalizar` en `logic.js`), en vez de convertir `"124"` a número cada vez que lo necesito. Descarté convertir al ordenar o al pintar, porque repetiría la conversión y los datos raros (vacíos, `"N/A"`) tendrían que tratarse en varios sitios.
2. La caché vive dentro de `api.js`, así que el resto de la app no sabe si los datos vienen de la red o de `localStorage`. Descarté cachear en `main.js` porque mezclaría la lógica de red con la de la interfaz.

# Brawl Dex

Misión M2 · Async Odyssey — Web Development I.

Aplicación hecha con Vite y JavaScript puro que consume la API pública BrawlAPI (de Brawlify) (`https://api.brawlapi.com/v1/brawlers`) y muestra todos los brawlers de Brawl Stars con buscador, filtro por clase, ordenación y un resumen con estadísticas.

## Cómo probarlo
Requisito: tener instalado Node.js (versión 20.19 o superior, porque lo pide Vite 7). Se puede comprobar con node --version en la terminal.

Hay que abrir la carpeta del proyecto en VSCode y abrimos una terminal VSCode eliges powershell y pones estos comandos:
```
npm install
npm run dev
```
Abre http://localhost:5173  en el navegador. Para ver el estado de error, desconecta internet (o la red en DevTools) y recarga: aparece el mensaje con el botón «Reintentar».

## Estructura
├── index.html      # página única; carga src/main.js
├── package.json    # nombre, scripts y dependencias
└── src/
    ├── main.js     # conecta todo y gestiona los eventos
    ├── api.js      # red: fetch, comprobación de errores y caché
    ├── logic.js    # datos: limpieza y transformación, sin tocar el DOM
    ├── render.js   # DOM: crea y pinta los nodos
    └── style.css   # estilos

- `src/api.js`: hace la petición con `fetch` + `async/await`, comprobación de `response.ok` y guarda el resultado en `localStorage` (caché de 10 min).
- `src/logic.js`: recibe los datos tal como llegan de la API y los limpia y transforma con `filter` / `map` / `reduce` / `toSorted`, sin tocar el DOM.
- `src/render.js`: crea y pinta los nodos del DOM (carga, error, vacío, tarjetas).
- `src/main.js`: conecta todo y gestiona los eventos.

## Uso de IA
He usado Claude como ayuda para programar este proyecto.

Qué hizo Claude: escribió el código. Hizo la primera versión (el proyecto con Vite, los módulos api, logic, render y main, el fetch con async/await, los mensajes de carga y de error, y la caché) y después fue cambiándola según lo que yo le pedía. También me explicó cómo arrancarlo y, cuando salió un error 404 porque la API había cambiado de dirección, buscó la dirección nueva y la corrigió.

Qué hice yo: elegí hacerlo con Brawl Stars y fui diciendo cómo quería que quedara:

Quitar a Vince y a Buzz Lightyear, porque no están en la app oficial (allí hay 107 brawlers).
Agrupar los brawlers por rareza (los míticos juntos, los legendarios juntos…) en vez de ordenarlos por gadgets o habilidades estelares, y poder ordenarlos también por nombre de la A a la Z.
Que cada tarjeta tenga el color de su rareza: por ejemplo, Spike es legendario, así que su tarjeta es amarilla.
Un fondo más claro en vez de azul.
Las descripciones en español, con un botón «Leer más» para ver el texto entero.

## Autopsia
1. Normalizo los datos una sola vez, nada más llegar en vez de comprobar cada campo cada vez que lo uso. En logic.js hay una función normalizar que, al recibir los datos de la API, convierte cada brawler en un objeto «limpio», siempre con la misma forma: nombre, rareza, clase, imagenes, descripcion, estrellas, gadgets… así el resto del código no tiene que preguntarse si falta algo.

Qué descarté: limpiar los datos justo al ordenarlos o al pintarlos. Habría tenido que repetir las mismas comprobaciones en varios sitios, y era fácil olvidarse de una y que la app fallara.

2. El código que guarda y lee la copia en localStorage está en api.js, justo donde se hace el fetch así que el resto de la app no sabe si los datos vienen de internet o de la copia guardada. Descarté ponerla en main.js: mezclaría la parte de red con la de la interfaz y main.js acabaría haciendo demasiadas cosas a la vez.

Qué descarté: poner la caché en main.js. Allí se mezclaría la lógica de la red con la de la interfaz (botones, selectores), y main.js acabaría haciendo demasiadas cosas a la vez.

3. Pinto con createElement y textContent, no con innerHTML.En render.js creo cada elemento de la página uno a uno (document.createElement) y pongo el texto con textContent.

Qué descarté: innerHTML con plantillas de texto. Es más corto de escribir, pero menos seguro, y los datos vienen de un servidor que yo no controlo.
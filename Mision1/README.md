# Tres en Raya

Misión M1 · El Despertar del DOM — Web Development I.

Un tres en raya en HTML + CSS + JavaScript puro, sin frameworks ni librerías. Se puede jugar contra la máquina o de dos jugadores, con marcador que suma victorias y empates.

## Cómo probarlo

Abre index.html en el navegador (o con Live Server).

- Haz clic en una casilla, o pulsa las teclas 1-9 (la 1 es la casilla de arriba a la izquierda).
- El botón «Modo» cambia entre jugar contra la máquina y jugar dos personas; el activo se ve resaltado.
- Tecla secreta: pulsa n para activar o desactivar el modo oscuro.

## Uso de IA

[COMPLETA ESTO CON TU VERSIÓN REAL. Ejemplo de estructura:]

Usé Claude (chat) para generar la primera versión del proyecto a partir del enunciado. Prompt real: "quiero hacer un 3 en raya en JS puro con HTML+CSS+JS separados, sin frameworks, cumpliendo esta rúbrica: [ Seleccionar y modificar nodos del DOM (querySelector, textContent, classList)
· Responder a eventos del usuario (click, input, teclado)
· Usar variables con let/const, funciones y estructuras de control con criterio
· Separar HTML, CSS y JS en archivos propios
Manipulación del DOM	Selección, creación y modificación de nodos de forma correcta y eficiente	
Eventos	Manejo de eventos bien estructurado, sin handlers inline en el HTML	
Fundamentos JS	Uso correcto de tipos, ámbitos, funciones y template literals".

Verifiqué lo generado jugando partidas completas gané con cada línea y columna, probé hacer empate a ver si funcionaba, pulsar una casilla que ocupada , intenté pulsar a Nueva partida mientras le tocaba turno a la máquina , para que comprobar que no se quedara una jugada fantasma, lo último que comprobé que funcionara era el modo oscuro con la tecla n varias veces por si en algún momento fallaba.

Escribí a mano la línea clearTimeout(temporizadorMaquina) al principio de la función reiniciar(). Al principio no la tenía, y me encontré con un bug: la máquina tarda medio segundo en jugar (para no parecer un robot). Si en ese medio segundo de espera pulsabas "Nueva partida", el tablero se limpiaba, pero la jugada de la máquina que estaba "en camino" llegaba igualmente y aparecía sola en el tablero nuevo, sin que nadie hubiera jugado. Le puse el nombre de "jugada fantasma". Añadí esa línea para cancelar esa jugada pendiente en el momento en que se reinicia la partida, y así se evita que aparezca.

## Autopsia


1. El estado del juego vive en una lista (casillas, con 9 huecos) y no se lee del texto que hay pintado en las celdas. Cuando haces clic, primero se guarda la jugada en casillas y solo después se pinta en pantalla; para saber quién ha ganado, el código mira la lista, no el HTML. Descarté leer textContent de cada celda cada vez que hace falta comprobar algo: es más lento y mezcla la lógica del juego con lo que se ve en pantalla.

2. Hay un único listener de clic puesto en el tablero completo, en vez de un listener en cada una de las 9 celdas. Cuando haces clic en una celda, el clic "sube" hasta el tablero y ahí se mira en qué celda exacta se hizo clic. Descarté poner nueve listeners porque las celdas se crean desde Java Script, y con uno solo en el tablero no hay que acordarse de enganchar cada celda nueva una a una.

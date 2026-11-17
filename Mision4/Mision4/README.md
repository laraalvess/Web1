# Torneo Brawl · Inscripción

Misión M4 · Full Contact Forms — Web Development I.

App en **React 19** para inscribirse a un torneo de Brawl Stars. Tiene un formulario con **React Hook Form + Zod** y una lista de inscritos con **TanStack Query v5**: al enviar el formulario se crea la inscripción y la lista se actualiza sola.

## Cómo arrancarlo 
Requisito: Node.js 20.19 o superior.

```
npm install
npm run dev
```
Abre http://localhost:5173. Al arrancar, Vite también levanta una API de mentira en `/api/inscripciones` (archivo `servidor-falso.js`, solo para desarrollo). Sus datos viven en memoria y se reinician al parar el servidor.

## Cómo ver cada estado
- **Errores de validación:** envía el formulario vacío, o pon una edad de 12, o emails distintos.
- **Cargando:** la lista tarda 600 ms en responder a propósito.
- **Error de la API:** inscríbete dos veces con el mismo email (responde 409) o para el servidor y recarga.
- **Éxito:** completa el formulario bien y envíalo.
- **Bonus (validar la respuesta de la API):** el servidor devuelve a propósito un registro corrupto (`id: 3`). Zod lo descarta con `safeParse` y la lista avisa de que se descartó 1 registro.

## Estructura
```
├── index.html
├── vite.config.js
├── servidor-falso.js        # API de mentira para desarrollo
├── package.json
└── src/
    ├── main.jsx             # monta la app y el QueryClientProvider
    ├── App.jsx
    ├── schema.js            # esquemas Zod (formulario y respuesta de la API)
    ├── api.js               # fetch: listar y crear, con manejo de errores
    ├── style.css
    └── components/
        ├── FormularioInscripcion.jsx   # React Hook Form + useMutation
        ├── ListaInscripciones.jsx      # useQuery + estados de carga/error/vacío
        └── Campo.jsx                   # etiqueta + control + error accesible
```

## Uso de IA
He usado Claude (claude.ai) para esta práctica.

**Qué hizo Claude:** escribió el proyecto completo a partir del enunciado: el formulario con React Hook Form, el esquema Zod, las consultas y la mutación con TanStack Query, la API de mentira y los estilos.

**Prompt real:** *«Tengo que hacer esta práctica, hazmela porfa»* (adjuntando el enunciado).

**Cómo lo verifiqué:** Claude comprobó que el proyecto compila con `npm run build` y que la API de mentira responde (listar, crear y el error 409 por email repetido). Hice todos los tipode de errores que hay para verificar que daban error y que así estaba bien, hice todo esto; envié el formulario vacío, puse una edad de 12, emails distintos.
Intenté inscribirme dos veces con el mismo email y responde 409 o para el servidor y recarga. Por último completé el formulario bien y lo envié.

**Qué escribí a mano:** No cambié nada a mano. 

## Autopsia
1. La validación está en un único esquema Zod (`inscripcionSchema`) conectado con `zodResolver`, y no en reglas sueltas dentro de cada `register`. Así las reglas (incluida la de que los dos emails coincidan) están en un solo sitio y se leen de un vistazo. Descarté poner `required`, `minLength` y similares en cada `register`: las reglas quedarían repartidas por el formulario y la del email repetido no cabría en ningún campo suelto.
2. La lista usa la clave `["inscripciones", { modo }]` y, al crear una inscripción, invalido `["inscripciones"]`. Con una sola invalidación se vuelven a pedir las listas de todos los filtros. Descarté añadir el registro nuevo a mano a la caché (`setQueryData`): es más rápido de ver, pero la lista puede quedar distinta de lo que realmente tiene el servidor.

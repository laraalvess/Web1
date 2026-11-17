import { z } from "zod";

export const MODOS = ["Atrapagemas", "Robo", "Supervivencia", "Balón Brawl"];

// Caracteres que usa Brawl Stars en las etiquetas de jugador.
const TAG = /^#[0289PYLQGRJCUV]{3,9}$/;

// ÚNICA fuente de verdad de la validación del formulario.
export const inscripcionSchema = z
  .object({
    jugador: z.string().trim().min(3, "Mínimo 3 caracteres").max(15, "Máximo 15 caracteres"),
    email: z.email("Escribe un email válido"),
    confirmaEmail: z.string(),
    edad: z.coerce
      .number({ error: "Escribe tu edad" })
      .int("La edad no puede tener decimales")
      .min(13, "Hay que tener 13 años o más para jugar")
      .max(99, "Esa edad no parece real"),
    tag: z.string().trim().toUpperCase().regex(TAG, "Empieza por # y usa de 3 a 9 caracteres válidos (0289PYLQGRJCUV)"),
    modo: z.enum(MODOS, { error: "Elige un modo de juego" }),
    normas: z.literal(true, { error: "Tienes que aceptar las normas" }),
  })
  // Refinamiento entre campos: el error se asocia a «confirmaEmail».
  .refine((datos) => datos.email === datos.confirmaEmail, {
    message: "Los emails no coinciden",
    path: ["confirmaEmail"],
  });

// Forma de un registro tal como debe llegar de la API (bonus: validar la respuesta).
export const registroSchema = z.object({
  id: z.number(),
  jugador: z.string().min(1),
  email: z.email(),
  edad: z.number().int(),
  tag: z.string().regex(TAG),
  modo: z.enum(MODOS),
});

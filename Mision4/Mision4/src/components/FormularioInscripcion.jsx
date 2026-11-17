import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inscripcionSchema, MODOS } from "../schema.js";
import { crearInscripcion } from "../api.js";
import Campo from "./Campo.jsx";

export default function FormularioInscripcion() {
  const queryClient = useQueryClient();

  // Formulario NO controlado: RHF lee los valores del DOM con register, sin useState por campo.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inscripcionSchema),
    mode: "onTouched",
    defaultValues: { jugador: "", email: "", confirmaEmail: "", edad: "", tag: "#", modo: "", normas: false },
  });

  const inscripcion = useMutation({
    mutationFn: crearInscripcion,
    onSuccess: () => {
      // Todas las listas ["inscripciones", ...] quedan obsoletas y se vuelven a pedir.
      queryClient.invalidateQueries({ queryKey: ["inscripciones"] });
      reset();
    },
  });

  // Atributos comunes de accesibilidad para cada campo.
  const campo = (nombre) => ({
    id: nombre,
    "aria-invalid": errors[nombre] ? "true" : "false",
    "aria-describedby": errors[nombre] ? `${nombre}-error` : undefined,
    ...register(nombre),
  });

  // confirmaEmail solo sirve para validar: no se envía al servidor.
  const enviar = ({ confirmaEmail, ...datos }) => inscripcion.mutate(datos);

  return (
    <section className="panel">
      <h2>Inscripción</h2>
      <form onSubmit={handleSubmit(enviar)} noValidate>
        <Campo id="jugador" etiqueta="Nombre de jugador" error={errors.jugador}>
          <input type="text" autoComplete="nickname" {...campo("jugador")} />
        </Campo>
        <Campo id="email" etiqueta="Email" error={errors.email}>
          <input type="email" autoComplete="email" {...campo("email")} />
        </Campo>
        <Campo id="confirmaEmail" etiqueta="Repite el email" error={errors.confirmaEmail}>
          <input type="email" autoComplete="off" {...campo("confirmaEmail")} />
        </Campo>
        <Campo id="edad" etiqueta="Edad" error={errors.edad}>
          <input type="number" inputMode="numeric" {...campo("edad")} />
        </Campo>
        <Campo id="tag" etiqueta="Tag de jugador" error={errors.tag}>
          <input type="text" autoCapitalize="characters" {...campo("tag")} />
        </Campo>
        <Campo id="modo" etiqueta="Modo de juego" error={errors.modo}>
          <select {...campo("modo")}>
            <option value="">Elige un modo…</option>
            {MODOS.map((modo) => (
              <option key={modo} value={modo}>{modo}</option>
            ))}
          </select>
        </Campo>
        <Campo id="normas" etiqueta="" error={errors.normas}>
          <label className="check">
            <input type="checkbox" {...campo("normas")} /> Acepto las normas del torneo
          </label>
        </Campo>

        <button type="submit" disabled={inscripcion.isPending}>
          {inscripcion.isPending ? "Enviando…" : "Inscribirme"}
        </button>

        <div aria-live="polite">
          {inscripcion.isSuccess && <p className="exito">✅ ¡Inscripción enviada! Ya apareces en la lista.</p>}
          {inscripcion.isError && <p className="error">⚠️ {inscripcion.error.message}</p>}
        </div>
      </form>
    </section>
  );
}

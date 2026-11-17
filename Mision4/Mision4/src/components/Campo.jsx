// Etiqueta + control + mensaje de error accesible (role="alert").
export default function Campo({ id, etiqueta, error, children }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

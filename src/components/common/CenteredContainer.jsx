/**
 * Contenedor centrado de ancho fluido para páginas de "una sola columna"
 * (auth, pago, not-found, modal-like). Acepta maxWidth para limitar
 * opcionalmente el ancho en pantallas grandes.
 */
export default function CenteredContainer({ as: Tag = 'div', maxWidth = 'md', className = '', children }) {
  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  return (
    <Tag className={`container-fluid ${widths[maxWidth]} py-12 sm:py-16 ${className}`}>
      {children}
    </Tag>
  );
}
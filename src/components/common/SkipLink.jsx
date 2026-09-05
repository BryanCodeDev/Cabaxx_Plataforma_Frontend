/**
 * SkipLink — primer elemento enfocable de la página.
 * Permite a usuarios de teclado saltar al <main>.
 * Visible solo al recibir foco (outline animado).
 */
export default function SkipLink({ targetId = 'main-content', children = 'Saltar al contenido principal' }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-elev-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
    >
      {children}
    </a>
  );
}
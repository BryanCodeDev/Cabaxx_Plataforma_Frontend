export default function SectionHeading({ eyebrow, title, subtitle, action, align = 'left' }) {
  const centered = align === 'center';

  return (
    <div
      className={`flex gap-4 ${
        centered ? 'flex-col items-center text-center' : 'flex-col sm:flex-row sm:items-end sm:justify-between'
      }`}
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl text-text-primary md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

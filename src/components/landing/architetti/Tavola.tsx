// Il linguaggio visivo della pagina è quello della tavola tecnica: griglia da disegno,
// linee di quota, cartiglio. Tre pezzi piccoli, riusati nelle sezioni.

export function GrigliaTavola({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)',
      }}
    />
  )
}

// Linea di quota: due tacche, la misura al centro.
export function Quota({
  etichetta,
  className = '',
  tono = 'lime',
}: {
  etichetta: string
  className?: string
  tono?: 'lime' | 'navy'
}) {
  const linea = tono === 'lime' ? 'bg-lime-500/60' : 'bg-navy-950/40'
  const testo = tono === 'lime' ? 'text-lime-500' : 'text-navy-950'
  return (
    <div aria-hidden className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] uppercase ${testo} ${className}`}>
      <span className={`relative h-px flex-1 ${linea}`}>
        <span className={`absolute left-0 -top-[5px] h-[11px] w-px ${linea}`} />
      </span>
      <span className="text-center leading-[1.6]">{etichetta}</span>
      <span className={`relative h-px flex-1 ${linea}`}>
        <span className={`absolute right-0 -top-[5px] h-[11px] w-px ${linea}`} />
      </span>
    </div>
  )
}

// Cartiglio: il blocco in basso a destra di ogni tavola, qui usato come riepilogo.
export function Cartiglio({
  celle,
  className = '',
}: {
  celle: { k: string; v: string }[]
  className?: string
}) {
  return (
    <dl
      className={`grid grid-cols-2 sm:grid-cols-4 border border-white/[0.14] divide-x divide-y sm:divide-y-0 divide-white/[0.14] ${className}`}
    >
      {celle.map((c) => (
        <div key={c.k} className="px-4 py-3 min-w-0">
          <dt className="font-mono text-[10px] tracking-[0.16em] uppercase text-fog-500">{c.k}</dt>
          <dd className="font-display font-extrabold text-[17px] text-white mt-1 leading-tight">{c.v}</dd>
        </div>
      ))}
    </dl>
  )
}

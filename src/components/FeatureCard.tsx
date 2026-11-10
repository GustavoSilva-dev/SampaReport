export type FeatureIcon = 'pin' | 'users' | 'check'

export type FeatureCardProps = {
  icon: FeatureIcon
  eyebrow: string
  title: string
  description: string
}

function FeatureIcon({ name }: { name: FeatureIcon }) {
  if (name === 'pin') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
  }
  if (name === 'users') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.2a3 3 0 0 1 0 5.6M18 14.5c1.8.8 3 2.8 3 5.5" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
}

export function FeatureCard({ icon, eyebrow, title, description }: FeatureCardProps) {
  return (
    <article className="relative min-h-[260px] border-t-2 border-[#dfe7df] bg-white p-7 font-medium transition-transform hover:-translate-y-1 hover:border-[#12a879] sm:min-h-[300px]">
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f4ec] text-[#12a879] [&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-none [&>svg]:stroke-current [&>svg]:stroke-[1.6] [&>svg]:stroke-linecap-round [&>svg]:stroke-linejoin-round"><FeatureIcon name={icon} /></div>
      <div className="mb-3 font-mono text-[9px] uppercase tracking-[.12em] text-[#9baa9f]">{eyebrow}</div>
      <h3 className="mb-3 text-[19px] font-medium tracking-[-.03em] text-[#173b36]">{title}</h3>
      <p className="max-w-[260px] text-xs leading-5 text-[#71807a]">{description}</p>
      <span className="absolute bottom-6 right-7 text-[17px] text-[#12a879]" aria-hidden="true">↗</span>
    </article>
  )
}

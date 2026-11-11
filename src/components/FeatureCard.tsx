export type FeatureIcon = 'pin' | 'users' | 'check'

export type FeatureCardProps = {
  image?: string
  index: number
  title: string
  description: string
}

export function FeatureCard({ image, title, description, index }: FeatureCardProps) {
  return (
    <article key={title} className={`reveal-up reveal-delay-${Math.min(index + 1, 3)} relative border-b border-white/20 px-6 py-6 first:pt-0 md:border-b-0 md:border-r md:px-5 md:pt-7 md:first:pt-7`}>
      <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-emerald-400 md:-top-[5px] md:left-0" />
      <span className="font-mono text-[10px] text-emerald-300 border-1 rounded-3xl p-2">0{index + 1}</span>
      <h3 className="mt-5 text-sm font-medium">{title}</h3>
      <p className="mt-3 text-xs leading-6 text-white/60">{description}</p>
    </article>
  )
}

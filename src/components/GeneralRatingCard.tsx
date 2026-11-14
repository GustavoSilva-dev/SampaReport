export interface GeneralRatingCardProps {
  rating?: number
  totalReviews?: number
  isLoading?: boolean
}

export function GeneralRatingCard({
  rating = 3.7,
  totalReviews = 127,
  isLoading = false,
}: GeneralRatingCardProps) {
  const displayRating = Math.min(Math.max(rating, 0), 5)
  const filledStars = Math.round(displayRating)

  // Futuro GET /api/metrics/general-rating para substituir os valores fallback.
  return (
    <article
      className="mb-4 rounded-2xl border border-emerald-700 bg-white p-4 shadow-sm sm:p-5 moveRight"
      aria-busy={isLoading}
      aria-label="Avaliação geral dos serviços"
    >
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-56 rounded bg-zinc-200" />
          <div className="h-10 w-32 rounded bg-zinc-200" />
          <div className="h-3 w-64 rounded bg-zinc-200" />
        </div>
      ) : (
        <>
          <h2 className="text-sm font-bold text-[#183c36] sm:text-base">Avaliação Geral dos Serviços</h2>
          <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="text-2xl font-bold leading-none text-zinc-900 sm:text-4xl ratingAnimation">
              {displayRating.toFixed(1)}
              <span className="ml-1 text-base font-medium text-zinc-400 sm:text-lg">/ 5.0</span>
            </p>
          </div>
          <p className="mt-2 text-sm text-zinc-500">{totalReviews.toLocaleString('pt-BR')} cidadãos avaliaram os serviços prestados</p>
        </>
      )}
    </article>
  )
}

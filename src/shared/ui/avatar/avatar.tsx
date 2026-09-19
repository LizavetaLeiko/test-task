const AVATAR_COLORS = [
  '#F58529',
  '#E4405F',
  '#3B82F6',
  '#22C55E',
  '#8B5CF6',
  '#14B8A6',
  '#EF4444',
  '#F59E0B',
]

function colorFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? '#3B82F6'
}

export function Avatar({ seed, className = '' }: { seed: string; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: colorFor(seed) }}
      className={`flex shrink-0 items-center justify-center rounded-full ${className}`}
    >
      <span className="h-2/5 w-2/5 rounded-full bg-white" />
    </span>
  )
}

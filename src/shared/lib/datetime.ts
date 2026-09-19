export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatListTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) return formatTime(timestamp)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function isSameDay(a: number, b: number): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function formatDaySeparator(timestamp: number): string {
  const date = new Date(timestamp)
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)
  if (diffDays === 0) return 'сегодня'
  if (diffDays === 1) return 'вчера'
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

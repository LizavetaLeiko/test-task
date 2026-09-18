import { GreenApiError } from '@/shared/api/green-api'

export function describeError(error: unknown): string {
  if (error instanceof GreenApiError) {
    if (error.kind === 'network') {
      return 'Не удалось связаться с GREEN-API. Проверьте подключение к сети.'
    }
    if (error.kind === 'http' && error.status === 401) {
      return 'Неверные idInstance или apiTokenInstance.'
    }
    if (error.kind === 'http' && error.status === 429) {
      return 'Слишком много запросов к GREEN-API. Попробуйте позже.'
    }
    if (error.kind === 'http') {
      return `GREEN-API вернул ошибку ${error.status ?? ''}. Попробуйте позже.`
    }
    return 'Получен некорректный ответ от GREEN-API.'
  }
  if (error instanceof Error) return error.message
  return 'Произошла неизвестная ошибка.'
}

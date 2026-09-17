const CHAT_ID_SUFFIX = '@c.us'

export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '')
}

export function isValidPhone(raw: string): boolean {
  const digits = normalizePhone(raw)
  return digits.length >= 10 && digits.length <= 15
}

export function phoneToChatId(raw: string): string {
  const digits = normalizePhone(raw)
  if (!isValidPhone(digits)) {
    throw new Error('Invalid phone number')
  }
  return `${digits}${CHAT_ID_SUFFIX}`
}

export function chatIdToPhone(chatId: string): string {
  return chatId.replace(CHAT_ID_SUFFIX, '')
}

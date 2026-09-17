import { describe, expect, it } from 'vitest'
import { chatIdToPhone, isValidPhone, normalizePhone, phoneToChatId } from './phone'

describe('normalizePhone', () => {
  it('strips formatting characters', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('79991234567')
  })

  it('returns empty string for non-digit input', () => {
    expect(normalizePhone('abc')).toBe('')
  })
})

describe('isValidPhone', () => {
  it('accepts an 11-digit number', () => {
    expect(isValidPhone('+7 999 123 45 67')).toBe(true)
  })

  it('rejects too-short numbers', () => {
    expect(isValidPhone('12345')).toBe(false)
  })

  it('rejects too-long numbers', () => {
    expect(isValidPhone('1234567890123456')).toBe(false)
  })
})

describe('phoneToChatId', () => {
  it('builds a @c.us chatId from a formatted phone', () => {
    expect(phoneToChatId('+7 (999) 123-45-67')).toBe('79991234567@c.us')
  })

  it('throws on invalid phone', () => {
    expect(() => phoneToChatId('123')).toThrow('Invalid phone number')
  })
})

describe('chatIdToPhone', () => {
  it('extracts digits from a chatId', () => {
    expect(chatIdToPhone('79991234567@c.us')).toBe('79991234567')
  })
})

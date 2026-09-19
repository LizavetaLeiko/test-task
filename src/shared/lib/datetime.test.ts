import { describe, expect, it } from 'vitest'
import { formatDaySeparator, isSameDay } from './datetime'

const DAY = 86_400_000

describe('isSameDay', () => {
  it('returns true for two moments within the same day', () => {
    const morning = new Date(2026, 3, 9, 8, 0).getTime()
    const evening = new Date(2026, 3, 9, 22, 0).getTime()
    expect(isSameDay(morning, evening)).toBe(true)
  })

  it('returns false for different days', () => {
    const day1 = new Date(2026, 3, 9, 8, 0).getTime()
    const day2 = new Date(2026, 3, 10, 8, 0).getTime()
    expect(isSameDay(day1, day2)).toBe(false)
  })
})

describe('formatDaySeparator', () => {
  it('labels today as "сегодня"', () => {
    expect(formatDaySeparator(Date.now())).toBe('сегодня')
  })

  it('labels yesterday as "вчера"', () => {
    expect(formatDaySeparator(Date.now() - DAY)).toBe('вчера')
  })

  it('formats older dates as dd.mm.yy', () => {
    const older = new Date(2026, 3, 9).getTime()
    expect(formatDaySeparator(older)).toBe('09.04.26')
  })
})

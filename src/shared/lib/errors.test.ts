import { describe, expect, it } from 'vitest'
import { GreenApiError } from '@/shared/api/green-api'
import { describeError } from './errors'

describe('describeError', () => {
  it('describes a network error', () => {
    expect(describeError(new GreenApiError('x', 'network'))).toMatch(/сети/)
  })

  it('describes invalid credentials on 401', () => {
    expect(describeError(new GreenApiError('x', 'http', 401))).toMatch(/Неверные/)
  })

  it('describes rate limiting on 429', () => {
    expect(describeError(new GreenApiError('x', 'http', 429))).toMatch(/много запросов/)
  })

  it('falls back to a generic http message', () => {
    expect(describeError(new GreenApiError('x', 'http', 500))).toMatch(/500/)
  })

  it('passes through a plain Error message', () => {
    expect(describeError(new Error('boom'))).toBe('boom')
  })

  it('handles unknown values', () => {
    expect(describeError('nope')).toMatch(/неизвестная/)
  })
})

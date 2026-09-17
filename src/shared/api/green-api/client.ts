import type { GreenApiCredentials } from './types'

export const DEFAULT_API_URL = 'https://api.green-api.com'

export type GreenApiErrorKind = 'network' | 'http' | 'parse'

export class GreenApiError extends Error {
  readonly kind: GreenApiErrorKind
  readonly status?: number

  constructor(message: string, kind: GreenApiErrorKind, status?: number) {
    super(message)
    this.name = 'GreenApiError'
    this.kind = kind
    this.status = status
  }
}

type Method = 'GET' | 'POST' | 'DELETE'

interface RequestOptions {
  method: Method
  action: string
  segments?: (string | number)[]
  query?: Record<string, string | number | undefined>
  body?: unknown
  signal?: AbortSignal
}

function buildUrl(
  { idInstance, apiTokenInstance, apiUrl }: GreenApiCredentials,
  { action, segments = [], query }: RequestOptions,
): string {
  const base = (apiUrl ?? DEFAULT_API_URL).replace(/\/+$/, '')
  const tail = segments.map((s) => `/${encodeURIComponent(String(s))}`).join('')
  const url = new URL(
    `${base}/waInstance${idInstance}/${action}/${apiTokenInstance}${tail}`,
  )
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

export async function request<T>(
  credentials: GreenApiCredentials,
  options: RequestOptions,
): Promise<T | null> {
  let response: Response
  try {
    response = await fetch(buildUrl(credentials, options), {
      method: options.method,
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new GreenApiError('Failed to reach GREEN-API', 'network')
  }

  if (!response.ok) {
    throw new GreenApiError(
      `GREEN-API responded with error ${response.status}`,
      'http',
      response.status,
    )
  }

  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text) as T
  } catch {
    throw new GreenApiError('Invalid GREEN-API response', 'parse')
  }
}

const STORAGE_KEY = 'max-chat-demo-mode'

export function isDemoMode(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export async function startMocksIfEnabled(): Promise<void> {
  if (!isDemoMode()) return
  const { worker } = await import('./browser')
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
}

export async function setDemoMode(enabled: boolean): Promise<void> {
  localStorage.setItem(STORAGE_KEY, String(enabled))
  const { worker } = await import('./browser')
  if (enabled) {
    await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
  } else {
    worker.stop()
  }
}

import { useEffect, useState } from 'react'
import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { deleteNotification, receiveNotification } from '@/shared/api/green-api'
import { parseIncomingMessage } from './parse-notification'

const RETRY_DELAY_MS = 2000
const IDLE_DELAY_MS = 500

export type ConnectionStatus = 'connecting' | 'online' | 'error'

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })
}

export function useReceiveMessages(): ConnectionStatus {
  const credentials = useSessionStore((state) => state.credentials)
  const receiveMessage = useChatStore((state) => state.receiveMessage)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  useEffect(() => {
    if (!credentials) return

    const controller = new AbortController()
    const update = (next: ConnectionStatus) => {
      if (!controller.signal.aborted) setStatus(next)
    }

    const poll = async () => {
      while (!controller.signal.aborted) {
        try {
          const notification = await receiveNotification(
            credentials,
            5,
            controller.signal,
          )
          update('online')

          if (!notification) {
            await delay(IDLE_DELAY_MS, controller.signal)
            continue
          }

          const message = parseIncomingMessage(notification)
          if (message) receiveMessage(message)

          await deleteNotification(credentials, notification.receiptId, controller.signal)
        } catch {
          if (controller.signal.aborted) break
          update('error')
          await delay(RETRY_DELAY_MS, controller.signal)
        }
      }
    }

    void poll()

    return () => controller.abort()
  }, [credentials, receiveMessage])

  return status
}

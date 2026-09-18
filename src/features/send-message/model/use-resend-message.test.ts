import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { useChatStore } from '@/entities/chat'
import type { Message } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import { server } from '@/shared/config/test-server'
import { createQueryWrapper } from '@/shared/config/test-utils'
import { useResendMessage } from './use-resend-message'

const chatId = '79991234567@c.us'
const sendUrl = 'https://api.green-api.com/waInstance1101/sendMessage/token'

const failedMessage: Message = {
  id: 'temp-1',
  chatId,
  text: 'retry me',
  direction: 'outgoing',
  timestamp: 1,
  status: 'failed',
}

beforeEach(() => {
  useChatStore.setState({
    chats: [{ chatId, phone: '79991234567', createdAt: 1 }],
    messagesByChat: { [chatId]: [failedMessage] },
    activeChatId: chatId,
  })
  useSessionStore.setState({
    credentials: { idInstance: '1101', apiTokenInstance: 'token' },
    instanceState: 'authorized',
  })
})

describe('useResendMessage', () => {
  it('resends a failed message and marks it sent', async () => {
    server.use(http.post(sendUrl, () => HttpResponse.json({ idMessage: 'srv-1' })))

    const { result } = renderHook(() => useResendMessage(), {
      wrapper: createQueryWrapper(),
    })
    result.current.mutate(failedMessage)

    await waitFor(() => {
      const messages = useChatStore.getState().messagesByChat[chatId] ?? []
      expect(messages[0]?.status).toBe('sent')
    })
  })

  it('keeps the message failed when resend fails again', async () => {
    server.use(http.post(sendUrl, () => new HttpResponse(null, { status: 500 })))

    const { result } = renderHook(() => useResendMessage(), {
      wrapper: createQueryWrapper(),
    })
    result.current.mutate(failedMessage)

    await waitFor(() => {
      const messages = useChatStore.getState().messagesByChat[chatId] ?? []
      expect(messages[0]?.status).toBe('failed')
    })
  })
})

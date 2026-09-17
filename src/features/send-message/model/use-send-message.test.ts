import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { server } from '@/shared/config/test-server'
import { createQueryWrapper } from '@/shared/config/test-utils'
import { useSendMessage } from './use-send-message'

const chatId = '79991234567@c.us'
const sendUrl = 'https://api.green-api.com/waInstance1101/sendMessage/token'

beforeEach(() => {
  useChatStore.setState({ chats: [], messagesByChat: {}, activeChatId: null })
  useSessionStore.setState({
    credentials: { idInstance: '1101', apiTokenInstance: 'token' },
    instanceState: 'authorized',
  })
})

describe('useSendMessage', () => {
  it('adds an optimistic message and marks it sent on success', async () => {
    server.use(http.post(sendUrl, () => HttpResponse.json({ idMessage: 'srv-1' })))

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createQueryWrapper(),
    })
    result.current.mutate({ chatId, text: 'hello' })

    await waitFor(() =>
      expect(useChatStore.getState().messagesByChat[chatId] ?? []).toHaveLength(1),
    )
    const optimistic = (useChatStore.getState().messagesByChat[chatId] ?? [])[0]
    expect(optimistic?.direction).toBe('outgoing')

    await waitFor(() => {
      const messages = useChatStore.getState().messagesByChat[chatId] ?? []
      expect(messages[0]?.status).toBe('sent')
    })
  })

  it('marks the optimistic message as failed on error', async () => {
    server.use(http.post(sendUrl, () => new HttpResponse(null, { status: 500 })))

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createQueryWrapper(),
    })
    result.current.mutate({ chatId, text: 'hello' })

    await waitFor(() => {
      const messages = useChatStore.getState().messagesByChat[chatId] ?? []
      expect(messages[0]?.status).toBe('failed')
    })
  })
})

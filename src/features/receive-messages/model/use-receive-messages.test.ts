import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { server } from '@/shared/config/test-server'
import { useReceiveMessages } from './use-receive-messages'

const chatId = '79991234567@c.us'
const receiveUrl = 'https://api.green-api.com/waInstance1101/receiveNotification/token'
const deleteUrl =
  'https://api.green-api.com/waInstance1101/deleteNotification/token/:receiptId'

beforeEach(() => {
  useChatStore.setState({ chats: [], messagesByChat: {}, activeChatId: null })
  useSessionStore.setState({
    credentials: { idInstance: '1101', apiTokenInstance: 'token' },
    instanceState: 'authorized',
  })
})

describe('useReceiveMessages', () => {
  it('stores an incoming message and acknowledges the notification', async () => {
    let receiveCalls = 0
    let deletedReceiptId: string | null = null

    server.use(
      http.get(receiveUrl, () => {
        receiveCalls += 1
        if (receiveCalls === 1) {
          return HttpResponse.json({
            receiptId: 42,
            body: {
              typeWebhook: 'incomingMessageReceived',
              timestamp: 1700000000,
              idMessage: 'msg-1',
              senderData: { chatId, sender: chatId },
              messageData: {
                typeMessage: 'textMessage',
                textMessageData: { textMessage: 'reply' },
              },
            },
          })
        }
        return new HttpResponse(null, { status: 200 })
      }),
      http.delete(deleteUrl, ({ params }) => {
        deletedReceiptId = String(params.receiptId)
        return HttpResponse.json({ result: true })
      }),
    )

    const { unmount } = renderHook(() => useReceiveMessages())

    await waitFor(() =>
      expect(useChatStore.getState().messagesByChat[chatId] ?? []).toHaveLength(1),
    )
    await waitFor(() => expect(deletedReceiptId).toBe('42'))

    const messages = useChatStore.getState().messagesByChat[chatId] ?? []
    expect(messages[0]?.text).toBe('reply')
    expect(messages[0]?.direction).toBe('incoming')

    unmount()
  })
})

import { describe, expect, it } from 'vitest'
import type { Notification } from '@/shared/api/green-api'
import { parseIncomingMessage } from './parse-notification'

function incoming(text: unknown): Notification {
  return {
    receiptId: 1,
    body: {
      typeWebhook: 'incomingMessageReceived',
      timestamp: 1700000000,
      idMessage: 'msg-1',
      senderData: { chatId: '79991234567@c.us', sender: '79991234567@c.us' },
      messageData: {
        typeMessage: 'textMessage',
        textMessageData: { textMessage: text as string },
      },
    },
  } as Notification
}

describe('parseIncomingMessage', () => {
  it('maps an incoming text message to a Message', () => {
    const message = parseIncomingMessage(incoming('hello'))

    expect(message).toEqual({
      id: 'msg-1',
      chatId: '79991234567@c.us',
      text: 'hello',
      direction: 'incoming',
      timestamp: 1700000000000,
    })
  })

  it('reads text from extendedTextMessageData', () => {
    const notification = {
      receiptId: 2,
      body: {
        typeWebhook: 'incomingMessageReceived',
        timestamp: 1700000000,
        idMessage: 'msg-2',
        senderData: { chatId: '79991234567@c.us', sender: '79991234567@c.us' },
        messageData: {
          typeMessage: 'extendedTextMessage',
          extendedTextMessageData: { textMessage: 'link message' },
        },
      },
    } as Notification

    expect(parseIncomingMessage(notification)?.text).toBe('link message')
  })

  it('ignores non-incoming webhooks', () => {
    const notification = {
      receiptId: 3,
      body: { typeWebhook: 'outgoingMessageStatus', timestamp: 1 },
    } as Notification

    expect(parseIncomingMessage(notification)).toBeNull()
  })

  it('ignores messages without text', () => {
    expect(parseIncomingMessage(incoming(undefined))).toBeNull()
  })
})

import { http, HttpResponse } from 'msw'
import type { Notification } from '@/shared/api/green-api'

const BASE = 'https://api.green-api.com'

const pendingReplies: Notification[] = []
let counter = 0

function queueReply(chatId: string, sourceText: string) {
  counter += 1
  const reply: Notification = {
    receiptId: counter,
    body: {
      typeWebhook: 'incomingMessageReceived',
      timestamp: Math.floor(Date.now() / 1000),
      idMessage: `mock-in-${counter}`,
      senderData: { chatId, sender: chatId },
      messageData: {
        typeMessage: 'textMessage',
        textMessageData: { textMessage: `Автоответ на: «${sourceText}»` },
      },
    },
  }
  setTimeout(() => pendingReplies.push(reply), 1200)
}

export const handlers = [
  http.get(`${BASE}/:instance/getStateInstance/:token`, () =>
    HttpResponse.json({ stateInstance: 'authorized' }),
  ),

  http.post(`${BASE}/:instance/sendMessage/:token`, async ({ request }) => {
    const body = (await request.json()) as { chatId: string; message: string }
    const shouldFail =
      body.message.toLowerCase().includes('ошибка') || body.message.trim() === '/fail'
    if (shouldFail) {
      return new HttpResponse(null, { status: 500 })
    }
    queueReply(body.chatId, body.message)
    counter += 1
    return HttpResponse.json({ idMessage: `mock-out-${counter}` })
  }),

  http.get(`${BASE}/:instance/receiveNotification/:token`, () => {
    const next = pendingReplies.shift()
    if (next) return HttpResponse.json(next)
    return new HttpResponse('', { status: 200 })
  }),

  http.delete(`${BASE}/:instance/deleteNotification/:token/:receiptId`, () =>
    HttpResponse.json({ result: true }),
  ),
]

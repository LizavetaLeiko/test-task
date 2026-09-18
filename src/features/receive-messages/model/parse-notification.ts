import type { Message } from '@/entities/message'
import type { Notification } from '@/shared/api/green-api'

export function parseIncomingMessage(notification: Notification): Message | null {
  const { body } = notification
  if (body.typeWebhook !== 'incomingMessageReceived') return null
  if (!body.senderData || !body.idMessage) return null

  const text =
    body.messageData?.textMessageData?.textMessage ??
    body.messageData?.extendedTextMessageData?.textMessage

  if (typeof text !== 'string') return null

  return {
    id: body.idMessage,
    chatId: body.senderData.chatId,
    text,
    direction: 'incoming',
    timestamp: body.timestamp * 1000,
  }
}

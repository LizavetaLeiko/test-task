export interface GreenApiCredentials {
  idInstance: string
  apiTokenInstance: string
  apiUrl?: string
}

export type InstanceState =
  'authorized' | 'notAuthorized' | 'blocked' | 'sleepMode' | 'starting' | 'yellowCard'

export interface StateInstanceResponse {
  stateInstance: InstanceState
}

export interface SendMessagePayload {
  chatId: string
  message: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface DeleteNotificationResponse {
  result: boolean
  reason?: string
}

export interface TextMessageData {
  textMessage: string
}

export interface MessageData {
  typeMessage: string
  textMessageData?: TextMessageData
  extendedTextMessageData?: TextMessageData
}

export interface SenderData {
  chatId: string
  sender: string
  senderName?: string
}

interface WebhookBase {
  typeWebhook: string
  timestamp: number
  idMessage?: string
  senderData?: SenderData
  messageData?: MessageData
}

export interface IncomingMessageWebhook extends WebhookBase {
  typeWebhook: 'incomingMessageReceived'
  idMessage: string
  senderData: SenderData
  messageData: MessageData
}

export interface OutgoingMessageWebhook extends WebhookBase {
  typeWebhook: 'outgoingMessageReceived' | 'outgoingAPIMessageReceived'
  idMessage: string
  senderData: SenderData
  messageData: MessageData
}

export type NotificationBody =
  IncomingMessageWebhook | OutgoingMessageWebhook | WebhookBase

export interface Notification {
  receiptId: number
  body: NotificationBody
}

import { request } from './client'
import type {
  DeleteNotificationResponse,
  GreenApiCredentials,
  Notification,
  SendMessagePayload,
  SendMessageResponse,
  StateInstanceResponse,
} from './types'

export function getStateInstance(
  credentials: GreenApiCredentials,
  signal?: AbortSignal,
): Promise<StateInstanceResponse | null> {
  return request<StateInstanceResponse>(credentials, {
    method: 'GET',
    action: 'getStateInstance',
    signal,
  })
}

export function sendMessage(
  credentials: GreenApiCredentials,
  payload: SendMessagePayload,
  signal?: AbortSignal,
): Promise<SendMessageResponse | null> {
  return request<SendMessageResponse>(credentials, {
    method: 'POST',
    action: 'sendMessage',
    body: payload,
    signal,
  })
}

export function receiveNotification(
  credentials: GreenApiCredentials,
  receiveTimeout = 5,
  signal?: AbortSignal,
): Promise<Notification | null> {
  return request<Notification>(credentials, {
    method: 'GET',
    action: 'receiveNotification',
    query: { receiveTimeout },
    signal,
  })
}

export function deleteNotification(
  credentials: GreenApiCredentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<DeleteNotificationResponse | null> {
  return request<DeleteNotificationResponse>(credentials, {
    method: 'DELETE',
    action: 'deleteNotification',
    segments: [receiptId],
    signal,
  })
}

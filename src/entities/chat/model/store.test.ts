import { beforeEach, describe, expect, it } from 'vitest'
import { useChatStore } from './store'

beforeEach(() => {
  useChatStore.setState({ chats: [], messagesByChat: {}, activeChatId: null })
})

describe('chat store', () => {
  it('creates a chat from a phone and marks it active', () => {
    const chat = useChatStore.getState().createChat('+7 999 123 45 67')

    expect(chat.chatId).toBe('79991234567@c.us')
    expect(chat.phone).toBe('79991234567')
    expect(useChatStore.getState().chats).toHaveLength(1)
    expect(useChatStore.getState().activeChatId).toBe('79991234567@c.us')
  })

  it('does not duplicate an existing chat', () => {
    useChatStore.getState().createChat('+7 999 123 45 67')
    useChatStore.getState().createChat('79991234567')

    expect(useChatStore.getState().chats).toHaveLength(1)
  })

  it('appends messages and updates them by id', () => {
    const chatId = '79991234567@c.us'
    useChatStore.getState().createChat('79991234567')
    useChatStore.getState().addMessage({
      id: 'temp-1',
      chatId,
      text: 'hi',
      direction: 'outgoing',
      timestamp: 1,
      status: 'pending',
    })

    expect(useChatStore.getState().messagesByChat[chatId] ?? []).toHaveLength(1)

    useChatStore.getState().updateMessage('temp-1', { status: 'sent' })

    const messages = useChatStore.getState().messagesByChat[chatId] ?? []
    expect(messages[0]?.status).toBe('sent')
  })

  it('receiveMessage creates the chat if it is unknown', () => {
    const chatId = '79991234567@c.us'
    useChatStore.getState().receiveMessage({
      id: 'srv-1',
      chatId,
      text: 'reply',
      direction: 'incoming',
      timestamp: 1,
    })

    expect(useChatStore.getState().chats).toHaveLength(1)
    expect(useChatStore.getState().messagesByChat[chatId] ?? []).toHaveLength(1)
  })

  it('receiveMessage ignores duplicate ids', () => {
    const chatId = '79991234567@c.us'
    const message = {
      id: 'srv-1',
      chatId,
      text: 'reply',
      direction: 'incoming' as const,
      timestamp: 1,
    }
    useChatStore.getState().receiveMessage(message)
    useChatStore.getState().receiveMessage(message)

    expect(useChatStore.getState().messagesByChat[chatId] ?? []).toHaveLength(1)
  })
})

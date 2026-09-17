import { create } from 'zustand'
import type { Message } from '@/entities/message'
import { chatIdToPhone, phoneToChatId } from '@/shared/lib/phone'
import type { Chat } from './types'

interface ChatState {
  chats: Chat[]
  messagesByChat: Record<string, Message[]>
  activeChatId: string | null
  createChat: (phone: string) => Chat
  setActiveChat: (chatId: string) => void
  addMessage: (message: Message) => void
  updateMessage: (id: string, patch: Partial<Message>) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messagesByChat: {},
  activeChatId: null,

  createChat: (phone) => {
    const chatId = phoneToChatId(phone)
    const existing = get().chats.find((chat) => chat.chatId === chatId)
    if (existing) {
      set({ activeChatId: chatId })
      return existing
    }
    const chat: Chat = { chatId, phone: chatIdToPhone(chatId), createdAt: Date.now() }
    set((state) => ({
      chats: [chat, ...state.chats],
      messagesByChat: { ...state.messagesByChat, [chatId]: [] },
      activeChatId: chatId,
    }))
    return chat
  },

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  addMessage: (message) =>
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [message.chatId]: [...(state.messagesByChat[message.chatId] ?? []), message],
      },
    })),

  updateMessage: (id, patch) =>
    set((state) => {
      const next: Record<string, Message[]> = {}
      for (const [chatId, messages] of Object.entries(state.messagesByChat)) {
        next[chatId] = messages.map((message) =>
          message.id === id ? { ...message, ...patch } : message,
        )
      }
      return { messagesByChat: next }
    }),
}))

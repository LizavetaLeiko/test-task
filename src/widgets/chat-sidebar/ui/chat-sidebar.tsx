import { useState } from 'react'
import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'
import { formatListTimestamp } from '@/shared/lib/datetime'
import { Avatar } from '@/shared/ui'

export function ChatSidebar() {
  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const messagesByChat = useChatStore((state) => state.messagesByChat)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const clearSession = useSessionStore((state) => state.clearSession)
  const [isCreateOpen, setCreateOpen] = useState(false)

  return (
    <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <span className="text-xl font-semibold text-gray-800">Чаты</span>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          aria-label="Новый чат"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <ul className="scrollbar-thin flex-1 overflow-y-auto">
        {chats.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-gray-400">
            Пока нет чатов.
            <br />
            Создайте первый по кнопке «+».
          </li>
        )}
        {chats.map((chat) => {
          const messages = messagesByChat[chat.chatId] ?? []
          const last = messages[messages.length - 1]
          return (
            <li key={chat.chatId}>
              <button
                type="button"
                onClick={() => setActiveChat(chat.chatId)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                  chat.chatId === activeChatId ? 'bg-blue-50' : ''
                }`}
              >
                <Avatar seed={chat.chatId} className="h-10 w-10" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-800">
                      +{chat.phone}
                    </span>
                    {last && (
                      <span className="shrink-0 text-xs text-gray-400">
                        {formatListTimestamp(last.timestamp)}
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-xs text-gray-400">
                    {last ? last.text : 'Нет сообщений'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={clearSession}
        className="border-t border-gray-200 p-3 text-left text-sm text-gray-500 hover:bg-gray-50"
      >
        Выйти
      </button>

      {isCreateOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Новый чат</span>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                aria-label="Закрыть"
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <CreateChatForm onCreated={() => setCreateOpen(false)} />
          </div>
        </div>
      )}
    </aside>
  )
}

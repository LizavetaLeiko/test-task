import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'

export function ChatSidebar() {
  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const messagesByChat = useChatStore((state) => state.messagesByChat)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const clearSession = useSessionStore((state) => state.clearSession)

  return (
    <aside className="flex w-72 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <span className="text-lg font-semibold text-gray-800">Чаты</span>
        <button
          type="button"
          onClick={clearSession}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Выйти
        </button>
      </div>

      <div className="border-b border-gray-200 p-3">
        <CreateChatForm />
      </div>

      <ul className="flex-1 overflow-y-auto">
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
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                  {chat.phone.slice(-2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-gray-800">
                    +{chat.phone}
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
    </aside>
  )
}

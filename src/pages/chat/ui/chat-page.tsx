import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'
import { MessageInput } from '@/features/send-message'

export function ChatPage() {
  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const messagesByChat = useChatStore((state) => state.messagesByChat)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const clearSession = useSessionStore((state) => state.clearSession)

  const activeChat = chats.find((chat) => chat.chatId === activeChatId)
  const messages = activeChatId ? (messagesByChat[activeChatId] ?? []) : []

  return (
    <div className="flex h-full bg-white">
      <aside className="flex w-72 flex-col border-r border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 p-3">
          <span className="font-semibold text-gray-800">Чаты</span>
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
          {chats.map((chat) => (
            <li key={chat.chatId}>
              <button
                type="button"
                onClick={() => setActiveChat(chat.chatId)}
                className={`w-full px-3 py-3 text-left text-sm hover:bg-gray-50 ${
                  chat.chatId === activeChatId ? 'bg-blue-50 font-medium' : ''
                }`}
              >
                +{chat.phone}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex flex-1 flex-col">
        {activeChat ? (
          <>
            <header className="border-b border-gray-200 p-3 font-medium text-gray-800">
              +{activeChat.phone}
            </header>
            <ul className="flex flex-1 flex-col gap-2 overflow-y-auto bg-gray-50 p-4">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                    message.direction === 'outgoing'
                      ? 'self-end bg-blue-600 text-white'
                      : 'self-start bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {message.text}
                  {message.status === 'pending' && (
                    <span className="ml-1 text-xs opacity-70">…</span>
                  )}
                  {message.status === 'failed' && (
                    <span className="ml-1 text-xs text-red-200">!</span>
                  )}
                </li>
              ))}
            </ul>
            <MessageInput chatId={activeChat.chatId} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            Выберите чат или создайте новый
          </div>
        )}
      </main>
    </div>
  )
}

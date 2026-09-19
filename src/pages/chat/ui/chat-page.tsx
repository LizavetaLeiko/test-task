import { useChatStore } from '@/entities/chat'
import { useReceiveMessages } from '@/features/receive-messages'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'

export function ChatPage() {
  const connection = useReceiveMessages()

  const activeChat = useChatStore((state) =>
    state.chats.find((chat) => chat.chatId === state.activeChatId),
  )

  return (
    <div className="flex h-full flex-col bg-white">
      {connection === 'error' && (
        <div
          role="status"
          className="bg-amber-100 px-4 py-1 text-center text-xs text-amber-800"
        >
          Соединение с GREEN-API потеряно, переподключаемся…
        </div>
      )}
      <div className="flex min-h-0 flex-1">
        <div
          className={`w-full shrink-0 md:block md:w-72 ${
            activeChat ? 'hidden' : 'block'
          }`}
        >
          <ChatSidebar />
        </div>
        <main className={`min-w-0 flex-1 md:block ${activeChat ? 'block' : 'hidden'}`}>
          {activeChat ? (
            <ChatWindow chat={activeChat} />
          ) : (
            <div className="chat-bg flex h-full items-center justify-center text-sm text-gray-700">
              Выберите чат или создайте новый
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

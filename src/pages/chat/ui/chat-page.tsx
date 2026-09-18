import { useChatStore } from '@/entities/chat'
import { useReceiveMessages } from '@/features/receive-messages'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'

export function ChatPage() {
  useReceiveMessages()

  const activeChat = useChatStore((state) =>
    state.chats.find((chat) => chat.chatId === state.activeChatId),
  )

  return (
    <div className="flex h-full bg-white">
      <ChatSidebar />
      <main className="flex-1">
        {activeChat ? (
          <ChatWindow chat={activeChat} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Выберите чат или создайте новый
          </div>
        )}
      </main>
    </div>
  )
}

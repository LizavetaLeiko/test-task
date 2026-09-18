import { useEffect, useRef } from 'react'
import type { Chat } from '@/entities/chat'
import { useChatStore } from '@/entities/chat'
import { MessageBubble } from '@/entities/message'
import { MessageInput, useResendMessage } from '@/features/send-message'

export function ChatWindow({ chat }: { chat: Chat }) {
  const messages = useChatStore((state) => state.messagesByChat[chat.chatId]) ?? []
  const resend = useResendMessage()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white p-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
          {chat.phone.slice(-2)}
        </span>
        <span className="font-medium text-gray-800">+{chat.phone}</span>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto bg-blue-50 p-4">
        {messages.length === 0 ? (
          <p className="mt-8 text-center text-sm text-gray-400">
            Напишите первое сообщение
          </p>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} onRetry={resend.mutate} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput chatId={chat.chatId} />
    </div>
  )
}

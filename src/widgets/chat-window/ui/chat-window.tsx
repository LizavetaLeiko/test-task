import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import type { Chat } from '@/entities/chat'
import { useChatStore } from '@/entities/chat'
import { MessageBubble } from '@/entities/message'
import { MessageInput, useResendMessage } from '@/features/send-message'
import { formatDaySeparator, isSameDay } from '@/shared/lib/datetime'
import { Avatar } from '@/shared/ui'

function SystemPill({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center">
      <span className="rounded-full bg-white/60 px-3 py-1 text-xs text-gray-600">
        {children}
      </span>
    </div>
  )
}

export function ChatWindow({ chat }: { chat: Chat }) {
  const messages = useChatStore((state) => state.messagesByChat[chat.chatId]) ?? []
  const clearActiveChat = useChatStore((state) => state.clearActiveChat)
  const resend = useResendMessage()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white p-3">
        <button
          type="button"
          onClick={clearActiveChat}
          aria-label="Назад к списку чатов"
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Avatar seed={chat.chatId} className="h-10 w-10" />
        <span className="font-medium text-gray-800">+{chat.phone}</span>
      </header>

      <div
        aria-live="polite"
        className="chat-bg scrollbar-thin scrollbar-light flex-1 space-y-2 overflow-y-auto p-4"
      >
        <SystemPill>Вы создали чат</SystemPill>
        {messages.map((message, index) => {
          const prev = messages[index - 1]
          const showDay = !prev || !isSameDay(prev.timestamp, message.timestamp)
          return (
            <Fragment key={message.id}>
              {showDay && (
                <SystemPill>{formatDaySeparator(message.timestamp)}</SystemPill>
              )}
              <MessageBubble message={message} onRetry={resend.mutate} />
            </Fragment>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput chatId={chat.chatId} />
    </div>
  )
}

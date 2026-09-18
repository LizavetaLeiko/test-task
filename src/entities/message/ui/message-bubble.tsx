import { memo } from 'react'
import { formatTime } from '@/shared/lib/datetime'
import type { Message } from '../model/types'

interface MessageBubbleProps {
  message: Message
  onRetry?: (message: Message) => void
}

function MessageBubbleComponent({ message, onRetry }: MessageBubbleProps) {
  const isOutgoing = message.direction === 'outgoing'

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
          isOutgoing ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <p className="break-words whitespace-pre-wrap">{message.text}</p>
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isOutgoing ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isOutgoing && message.status === 'pending' && <span>…</span>}
          {isOutgoing && message.status === 'failed' && (
            <button
              type="button"
              onClick={() => onRetry?.(message)}
              className="font-medium text-red-200 underline"
            >
              Не отправлено · Повторить
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export const MessageBubble = memo(MessageBubbleComponent)

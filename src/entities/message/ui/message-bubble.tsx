import { memo } from 'react'
import { formatTime } from '@/shared/lib/datetime'
import type { Message } from '../model/types'

interface MessageBubbleProps {
  message: Message
  onRetry?: (message: Message) => void
}

function MessageBubbleComponent({ message, onRetry }: MessageBubbleProps) {
  const isOutgoing = message.direction === 'outgoing'
  const showStatus =
    isOutgoing && (message.status === 'pending' || message.status === 'failed')

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[70%] flex-col ${
          isOutgoing ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
            isOutgoing ? 'bg-sky-100 text-gray-800' : 'bg-white text-gray-800'
          }`}
        >
          <p className="break-words whitespace-pre-wrap">{message.text}</p>
          <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400">
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>
        {showStatus && (
          <div className="relative mt-1 px-1 text-[12px]">
            <span aria-hidden className="invisible whitespace-nowrap">
              Не отправлено · Повторить
            </span>
            <span className="absolute inset-0 px-1 text-right whitespace-nowrap">
              {message.status === 'pending' ? (
                <span className="text-gray-400">Отправляется…</span>
              ) : (
                <span className="text-red-500">
                  Не отправлено ·{' '}
                  <button
                    type="button"
                    onClick={() => onRetry?.(message)}
                    className="font-medium underline"
                  >
                    Повторить
                  </button>
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export const MessageBubble = memo(MessageBubbleComponent)

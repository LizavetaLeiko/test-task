import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useSendMessage } from '../model/use-send-message'

export function MessageInput({ chatId }: { chatId: string }) {
  const [text, setText] = useState('')
  const sendMessage = useSendMessage()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [chatId])

  const isValid = text.trim() !== ''

  const submit = () => {
    if (!isValid) return
    sendMessage.mutate({ chatId, text: text.trim() })
    setText('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
    >
      <textarea
        ref={inputRef}
        aria-label="Сообщение"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Сообщение"
        className="max-h-32 flex-1 resize-none rounded-3xl border border-transparent bg-gray-100 px-4 py-2 text-sm outline-none transition-colors focus:border-gray-200 focus:bg-white"
      />
      {isValid && (
        <button
          type="submit"
          aria-label="Отправить"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}
    </form>
  )
}

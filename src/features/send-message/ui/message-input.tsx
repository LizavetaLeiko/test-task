import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '@/shared/ui'
import { useSendMessage } from '../model/use-send-message'

export function MessageInput({ chatId }: { chatId: string }) {
  const [text, setText] = useState('')
  const sendMessage = useSendMessage()

  const isValid = text.trim() !== ''

  const submit = () => {
    if (!isValid) return
    sendMessage.mutate({ chatId, text: text.trim() })
    setText('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-gray-200 p-3"
    >
      <textarea
        aria-label="Сообщение"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Сообщение"
        className="max-h-32 flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <Button type="submit" disabled={!isValid}>
        Отправить
      </Button>
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import { useChatStore } from '@/entities/chat'
import { isValidPhone } from '@/shared/lib/phone'
import { Button, TextInput } from '@/shared/ui'

export function CreateChatForm() {
  const [phone, setPhone] = useState('')
  const createChat = useChatStore((state) => state.createChat)

  const isValid = isValidPhone(phone)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValid) return
    createChat(phone)
    setPhone('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <TextInput
        id="phone"
        label="Новый чат"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        inputMode="tel"
        placeholder="+7 999 123 45 67"
      />
      <Button type="submit" disabled={!isValid}>
        Создать чат
      </Button>
    </form>
  )
}

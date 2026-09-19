import { useState } from 'react'
import { useChatStore } from '@/entities/chat'
import { isValidPhone } from '@/shared/lib/phone'
import { Button, TextInput } from '@/shared/ui'

export function CreateChatForm({ onCreated }: { onCreated?: () => void }) {
  const [phone, setPhone] = useState('')
  const createChat = useChatStore((state) => state.createChat)

  const isValid = isValidPhone(phone)

  const submit = () => {
    if (!isValid) return
    createChat(phone)
    setPhone('')
    onCreated?.()
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      className="flex flex-col gap-2"
    >
      <TextInput
        id="phone"
        label="Номер телефона"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        inputMode="tel"
        autoFocus
        placeholder="+7 999 123 45 67"
      />
      <Button type="submit" disabled={!isValid}>
        Создать чат
      </Button>
    </form>
  )
}

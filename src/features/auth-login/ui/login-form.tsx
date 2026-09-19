import { useState } from 'react'
import { describeError } from '@/shared/lib/errors'
import { Button, TextInput } from '@/shared/ui'
import { useLogin } from '../model/use-login'

export function LoginForm() {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const login = useLogin()

  const isValid = idInstance.trim() !== '' && apiTokenInstance.trim() !== ''

  const submit = () => {
    if (!isValid) return
    login.mutate({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    })
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-800">MAX Chat</h1>
        <p className="mt-1 text-sm text-gray-500">
          Введите учётные данные вашего инстанса GREEN-API
        </p>
      </div>

      <TextInput
        id="idInstance"
        label="idInstance"
        value={idInstance}
        onChange={(event) => setIdInstance(event.target.value)}
        autoComplete="off"
        autoFocus
        placeholder="1101000001"
      />
      <TextInput
        id="apiTokenInstance"
        label="apiTokenInstance"
        type="password"
        value={apiTokenInstance}
        onChange={(event) => setApiTokenInstance(event.target.value)}
        autoComplete="off"
        placeholder="d75b3a66374942..."
      />

      {login.isError && (
        <p role="alert" className="text-sm text-red-600">
          {describeError(login.error)}
        </p>
      )}

      <Button type="submit" disabled={!isValid || login.isPending}>
        {login.isPending ? 'Проверка…' : 'Войти'}
      </Button>
    </form>
  )
}

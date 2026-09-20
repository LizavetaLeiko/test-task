import { useState } from 'react'
import { isDemoMode, setDemoMode } from '@/mocks/control'
import { describeError } from '@/shared/lib/errors'
import { Button, TextInput } from '@/shared/ui'
import { useLogin } from '../model/use-login'

export function LoginForm() {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [demo, setDemo] = useState(isDemoMode())
  const login = useLogin()

  const isValid = idInstance.trim() !== '' && apiTokenInstance.trim() !== ''

  const submit = () => {
    if (!isValid) return
    login.mutate({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    })
  }

  const toggleDemo = () => {
    const next = !demo
    setDemo(next)
    if (next && idInstance === '' && apiTokenInstance === '') {
      setIdInstance('demo')
      setApiTokenInstance('demo')
    }
    void setDemoMode(next)
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

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-500">
          Демо-режим
          <span className="block text-[11px] text-gray-400">
            без реального GREEN-API, любые данные
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={demo}
          aria-label="Демо-режим"
          onClick={toggleDemo}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            demo ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              demo ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </form>
  )
}

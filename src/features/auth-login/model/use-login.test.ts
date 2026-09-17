import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '@/entities/session'
import { server } from '@/shared/config/test-server'
import { createQueryWrapper } from '@/shared/config/test-utils'
import { useLogin } from './use-login'

const credentials = { idInstance: '1101', apiTokenInstance: 'token' }
const stateUrl = 'https://api.green-api.com/waInstance1101/getStateInstance/token'

beforeEach(() => {
  useSessionStore.setState({ credentials: null, instanceState: null })
})

describe('useLogin', () => {
  it('opens a session when the instance is authorized', async () => {
    server.use(
      http.get(stateUrl, () => HttpResponse.json({ stateInstance: 'authorized' })),
    )

    const { result } = renderHook(() => useLogin(), { wrapper: createQueryWrapper() })
    result.current.mutate(credentials)

    await waitFor(() =>
      expect(useSessionStore.getState().credentials).toEqual(credentials),
    )
    expect(useSessionStore.getState().instanceState).toBe('authorized')
  })

  it('fails and keeps session empty when not authorized', async () => {
    server.use(
      http.get(stateUrl, () => HttpResponse.json({ stateInstance: 'notAuthorized' })),
    )

    const { result } = renderHook(() => useLogin(), { wrapper: createQueryWrapper() })
    result.current.mutate(credentials)

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(useSessionStore.getState().credentials).toBeNull()
  })

  it('surfaces an HTTP error from GREEN-API', async () => {
    server.use(http.get(stateUrl, () => new HttpResponse(null, { status: 401 })))

    const { result } = renderHook(() => useLogin(), { wrapper: createQueryWrapper() })
    result.current.mutate(credentials)

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(useSessionStore.getState().credentials).toBeNull()
  })
})

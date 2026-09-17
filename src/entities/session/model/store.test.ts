import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from './store'

beforeEach(() => {
  useSessionStore.setState({ credentials: null, instanceState: null })
})

describe('session store', () => {
  it('stores credentials and instance state on setSession', () => {
    useSessionStore
      .getState()
      .setSession({ idInstance: '1101', apiTokenInstance: 'token' }, 'authorized')

    expect(useSessionStore.getState().credentials).toEqual({
      idInstance: '1101',
      apiTokenInstance: 'token',
    })
    expect(useSessionStore.getState().instanceState).toBe('authorized')
  })

  it('resets state on clearSession', () => {
    useSessionStore
      .getState()
      .setSession({ idInstance: '1101', apiTokenInstance: 'token' }, 'authorized')
    useSessionStore.getState().clearSession()

    expect(useSessionStore.getState().credentials).toBeNull()
    expect(useSessionStore.getState().instanceState).toBeNull()
  })
})

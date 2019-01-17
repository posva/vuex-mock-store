// @ts-check
const { Store } = require('../src')

describe('Store subscriptions', () => {
  it('subscribes to mutations', () => {
    const state = {}
    const store = new Store({ state })
    const spy = jest.fn()
    store.subscribe(spy)
    store.commit('mutation', 'payload')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      { type: 'mutation', payload: 'payload' },
      state
    )
  })

  it('resets subscriptions on reset', () => {
    const store = new Store()
    const spy = jest.fn()
    store.subscribe(spy)
    store.reset()
    store.commit('mutation', 'payload')
    expect(spy).not.toHaveBeenCalled()
  })

  it('returns an unsubscribe callback', () => {
    const store = new Store()
    const spy = jest.fn()
    const unsubscribe = store.subscribe(spy)
    unsubscribe()
    store.commit('mutation', 'payload')
    expect(spy).not.toHaveBeenCalled()
  })
})

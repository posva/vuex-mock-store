// @ts-check
const { Store } = require('../src')

describe('Store subscriptions', () => {
  it('subscribes to mutations', () => {
    const store = new Store({ state: {} })
    const spy = jest.fn()
    store.subscribe(spy)
    store.commit('mutation', 'payload')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      { type: 'mutation', payload: 'payload' },
      {},
    )
  })

  it('subscribes to actions', () => {
    const store = new Store({ state: {} })
    const spy = jest.fn()
    store.subscribeAction(spy)
    store.dispatch('action', 'payload')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ type: 'action', payload: 'payload' }, {})
  })

  it('cleans up handlers upon reset', () => {
    const store = new Store()
    const spy = jest.fn()
    store.subscribe(spy)
    store.subscribeAction(spy)
    // @ts-ignore
    expect(store._mutationsHandlers).toHaveLength(1)
    // @ts-ignore
    expect(store._actionsHandlers).toHaveLength(1)
    store.reset()
    // @ts-ignore
    expect(store._mutationsHandlers).toHaveLength(0)
    // @ts-ignore
    expect(store._actionsHandlers).toHaveLength(0)
  })

  it('resets subscriptions on reset', () => {
    const store = new Store()
    const spy = jest.fn()
    store.subscribe(spy)
    store.reset()
    store.commit('mutation', 'payload')
    expect(spy).not.toHaveBeenCalled()
  })

  it('can watch again after reset', () => {
    const store = new Store({ state: {} })
    store.reset()

    const mutation = jest.fn()
    const action = jest.fn()
    store.subscribe(mutation)
    store.subscribeAction(action)
    store.commit('mutation', 'payload')
    store.dispatch('action', 'payload')
    expect(mutation).toHaveBeenCalledTimes(1)
    expect(action).toHaveBeenCalledTimes(1)
    expect(mutation).toHaveBeenCalledWith(
      { type: 'mutation', payload: 'payload' },
      {},
    )
    expect(action).toHaveBeenCalledWith(
      { type: 'action', payload: 'payload' },
      {},
    )
  })

  it('returns an unsubscribe callback from subscribe', () => {
    const store = new Store()
    const spy = jest.fn()
    const unsubscribe = store.subscribe(spy)
    unsubscribe()
    store.commit('mutation', 'payload')
    expect(spy).not.toHaveBeenCalled()
  })

  it('resets actions subscriptions on reset', () => {
    const store = new Store()
    const spy = jest.fn()
    store.subscribeAction(spy)
    store.reset()
    store.dispatch('action', 'payload')
    expect(spy).not.toHaveBeenCalled()
  })

  it('returns an unsubscribe callback from subscribeAction', () => {
    const store = new Store()
    const spy = jest.fn()
    const unsubscribe = store.subscribeAction(spy)
    unsubscribe()
    store.dispatch('action', 'payload')
    expect(spy).not.toHaveBeenCalled()
  })
})

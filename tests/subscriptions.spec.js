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
})

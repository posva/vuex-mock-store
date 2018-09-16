const { Store } = require('../src')

describe('Store Mock', () => {
  it('copies the state', () => {
    const state = { n: 0 }
    const store = new Store({
      state,
    })

    expect(store.state).not.toBe(state)
    expect(store.state).toEqual(state)
  })
})

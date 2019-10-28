// @ts-check
const { Store } = require('../src')
const Helper = require('./Helper')
const { mount } = require('@vue/test-utils')
const { mapState } = require('vuex')

describe('Store Mock', () => {
  it('work with no args', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Store()
    }).not.toThrow()
    const store = new Store()
    expect(store.state).toEqual({})
    expect(store.getters).toEqual({})
  })

  it('copies the state', () => {
    const state = { n: 0 }
    const store = new Store({ state })

    expect(store.state).not.toBe(state)
    expect(store.state).toEqual(state)
  })

  it('deeply copies the state', () => {
    const state = { nested: { n: 0 } }
    const store = new Store({ state })

    expect(store.state.nested).not.toBe(state.nested)
    expect(store.state.nested).toEqual(state.nested)
  })

  it('copies getters', () => {
    const getters = { getter: 0 }
    const store = new Store({ getters })

    expect(store.getters).not.toBe(getters)
    expect(store.getters).toEqual(getters)
  })

  it('resets getters', () => {
    const getters = { n: 0 }
    const store = new Store({ getters })
    store.getters.n = 3
    store.reset()
    expect(store.getters.n).toBe(0)
  })

  it('resets the state', () => {
    const state = { n: 0 }
    const store = new Store({ state })

    store.state.n = 3
    store.reset()
    expect(store.state.n).toBe(0)
  })

  describe('using Helper', () => {
    const store = new Store({
      state: {
        counter: 0,
        module: { mCounter: 1, nested: { mmCounter: 3 } },
      },

      getters: {
        getter: 1,
        // getter: (...args) => (console.log(...args), 1),
        'module/mGetter': 2,
        'module/nested/mmGetter': 3,
      },
    })
    const mocks = { $store: store }
    /** @type {import('@vue/test-utils').Wrapper} */
    let wrapper
    beforeEach(() => {
      wrapper = mount(Helper, { mocks })
    })

    it('correctly maps state', () => {
      expect(wrapper.vm.counter).toBe(0)
      expect(wrapper.vm.mCounter).toBe(1)
      expect(wrapper.vm.mmCounter).toBe(3)
    })

    it('correctly maps getters', () => {
      expect(wrapper.vm.getter).toBe(1)
      expect(wrapper.vm.mGetter).toBe(2)
      expect(wrapper.vm.mmGetter).toBe(3)
    })

    it('triggers mapped actions', () => {
      wrapper.vm.action('a')
      expect(store.dispatch).toHaveBeenCalledWith('action', 'a')
      wrapper.vm.mAction('b')
      expect(store.dispatch).toHaveBeenCalledWith('module/mAction', 'b')
      wrapper.vm.mNestedAction('b')
      expect(store.dispatch).toHaveBeenCalledWith(
        'module/nested/mNestedAction',
        'b',
      )
    })

    it('triggers mapped commit', () => {
      wrapper.vm.mutation('c')
      expect(store.commit).toHaveBeenCalledWith('mutation', 'c')
      wrapper.vm.mMutation('d')
      expect(store.commit).toHaveBeenCalledWith('module/mMutation', 'd')
      wrapper.vm.mNestedMutation('e')
      expect(store.commit).toHaveBeenCalledWith(
        'module/nested/mNestedMutation',
        'e',
      )
    })

    it('throws with non-defined state', () => {
      /** @type {import('@vue/test-utils').Wrapper<typeof Helper>} */
      const wrapper = mount(
        {
          render: () => null,
          computed: mapState('nonExistent', ['a']),
        },
        { mocks },
      )
      expect(() => {
        // eslint-disable-next-line no-unused-expressions
        wrapper.vm.a
      }).toThrow(/module "nonExistent" not defined in state/)
    })
  })
})

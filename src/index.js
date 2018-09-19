const clone = require('lodash.clonedeep')

const spy = {
  create: () => jest.fn(),
  reset: spy => spy.mockReset(),
}

exports.spy = spy

exports.Store = class Store {
  constructor ({ getters = {}, state = {} } = {}) {
    this.commit = spy.create()
    this.dispatch = spy.create()
    this.__initialGetters = getters
    this.__initialState = state
    this._initialize()
    // this is necessary for map* helpers
    this._modulesNamespaceMap = new Proxy(
      {},
      {
        // always return the root store as the context module
        get: (target, key) => {
          if (typeof key !== 'string') return Reflect.get(this, key)

          const modules = key.split('/')
          // modules always have a trailing /
          if (modules.length > 1) {
            // remove trailing empty module
            modules.pop()
            // get the nested state corresponding to the module
            let state = this.state
            for (let module of modules) {
              if (state[module]) state = state[module]
              else {
                throw new Error(
                  `[vuex-mock-store] module "${key.slice(0, -1)}" not defined in state:`,
                  this.state
                )
              }
            }

            return {
              context: {
                _modulesNamespaceMap: this._modulesNamespaceMap,
                state,
                getters: this.getters,
              },
            }
          } else {
            return Reflect.get(this, key)
          }
        },
      }
    )
  }

  _initialize () {
    this.getters = { ...this.__initialGetters }
    this.state = clone(this.__initialState)
  }

  reset () {
    spy.reset(this.dispatch)
    spy.reset(this.commit)
    this._initialize()
  }
}

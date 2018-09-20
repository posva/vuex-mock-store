// @ts-check
const clone = require('lodash.clonedeep')

const defaultSpy = {
  create: () => jest.fn(),
  /**
   * @param {jest.Mock} spy
   */
  reset: spy => spy.mockReset(),
}

exports.spy = defaultSpy

exports.Store = class Store {
  constructor ({ getters = {}, state = {}, spy = defaultSpy } = {}) {
    this._spy = spy
    this.commit = this._spy.create()
    this.dispatch = this._spy.create()
    this._initialGetters = getters
    this._initialState = state
    this._initialize()
    // this is necessary for map* helpers
    /** @type {any} */
    this._modulesNamespaceMap = new Proxy(
      {},
      {
        get: (target, key) => {
          // for Symbols
          if (typeof key !== 'string') return Reflect.get(target, key)

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
                  `[vuex-mock-store] module "${key.slice(
                    0,
                    -1
                  )}" not defined in state:\n${JSON.stringify(this.state, null, 2)}`
                )
              }
            }

            return {
              context: {
                // make sure we reuse this proxy
                _modulesNamespaceMap: this._modulesNamespaceMap,
                // pass the right state
                state,
                // getters are not nested
                getters: this.getters,
              },
            }
          } else {
            return Reflect.get(target, key)
          }
        },
      }
    )
  }

  _initialize () {
    // getters is a plain object
    this.getters = { ...this._initialGetters }
    this.state = clone(this._initialState)
  }

  reset () {
    this._spy.reset(this.dispatch)
    this._spy.reset(this.commit)
    this._initialize()
  }
}

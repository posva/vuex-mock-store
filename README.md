# vuex-mock-store [![Build Status](https://badgen.net/circleci/github/posva/vuex-mock-store)](https://circleci.com/gh/posva/vuex-mock-store) [![npm package](https://badgen.net/npm/v/vuex-mock-store)](https://www.npmjs.com/package/vuex-mock-store) [![coverage](https://badgen.net/codecov/c/github/posva/vuex-mock-store)](https://codecov.io/github/posva/vuex-mock-store) [![thanks](https://img.shields.io/badge/thanks-%E2%99%A5-ff69b4.svg)](https://github.com/posva/thanks)

> Simple and straightforward mock for Vuex v3.x Store

Supports using `mapMutations` and `mapActions` as well as directly doing `this.$store.commit()` and `this.$store.dispatch()`

## Installation

```sh
npm install -D vuex-mock-store
# with yarn
yarn add -D vuex-mock-store
```

## Usage

ℹ️: _All examples use [Jest](#TODO) API_

Usage with [vue-test-utils](https://github.com/vuejs/vue-test-utils):

```js
import { Store } from 'vuex-mock-store'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

// create the Store mock
const store = new Store()
// add other mocks here so they are accessible in every component
const mocks = {
  $store: store,
}

// reset spies, initial state and getters
afterEach(() => store.reset())

describe('MyComponent.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(MyComponent, { mocks })
  })

  it('commits init on creation', () => {
    expect(store.commit).toHaveBeenCalledOnce()
    expect(store.commit).toHaveBeenCalledWith('init')
  })

  it('dispatch save when clicking button', () => {
    wrapper.find('button.save').trigger('click')
    expect(store.dispatch).toHaveBeenCalledOnce()
    expect(store.dispatch).toHaveBeenCalledWith('save', { name: 'Eduardo' })
  })
})
```

### Initial state and getters

You can provide a `getters`, and `state` object to mock them:

```js
const store = new Store({
  getters: {
    name: () => 'Eduardo',
  },
  state: {
    counter: 0,
  },
})
```

### Modules

To mock modules `state`, simply provide a nested object for `state`:

```js
new Store({
  state: {
    moduleA: {
      moduleC: {
        value: 'foo',
      },
    },
    moduleB: {
      value: 'bar',
    },
  },
})
```

Testing actions and mutations depend whether your [modules are namespaced](#TODO) or not. If they are namespaced, make sure to provide the full action/mutation name:

```js
// namespaced module
expect(store.commit).toHaveBeenCalledWith('moduleA/setValue')
expect(store.dispatch).toHaveBeenCalledWith('moduleA/postValue')
// non-namespaced
expect(store.commit).toHaveBeenCalledWith('setValue')
expect(store.dispatch).toHaveBeenCalledWith('postValue')
```

### Mutating `state`, providing custom `getters`

You can [modify](#state) the `state` and `getters` directly for any test. Calling `store.reset()` will reset them to the initial values provided.

## API

### `Store` class

#### `constructor(options)`

- `options`
  - `state`: initial state object, _default_: `{}`
  - `getters`: getters object, _default_: `{}`

#### `state`

Store state. You can directly modify it to change state:

```js
store.state.name = 'Jeff'
```

#### `getters`

Store getters. You can directly modify it to change the returned value by a getter:

```js
store.getters.upperCaseName = state => 'JEFF'
```

#### `reset`

Reset `commit` and `dispatch` spies and restore `getters` and `state` to their initial values

### `commit` & `dispatch`

Spies. Dependent on the testing framework

- [jest.fn](#TODO)
- [sinon.spy](#TODO)

## Related

- [vue-test-utils](https://github.com/vuejs/vue-test-utils)
- [vuex](https://github.com/vuejs/vuex)

## License

[MIT](http://opensource.org/licenses/MIT)

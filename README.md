# vuex-mock-store [![Build Status](https://badgen.net/circleci/github/posva/vuex-mock-store)](https://circleci.com/gh/posva/vuex-mock-store) [![npm package](https://badgen.net/npm/v/vuex-mock-store)](https://www.npmjs.com/package/vuex-mock-store) [![coverage](https://badgen.net/codecov/c/github/posva/vuex-mock-store)](https://codecov.io/github/posva/vuex-mock-store) [![thanks](https://img.shields.io/badge/thanks-%E2%99%A5-ff69b4.svg)](https://github.com/posva/thanks)

> Simple and straightforward mock for Vuex v3.x Store

Automatically creates spies on `commit` and `dispatch` so you can focus on testing your component without executing your store code.

## Installation

```sh
npm install -D vuex-mock-store
# with yarn
yarn add -D vuex-mock-store
```

## Usage

ℹ️: _All examples use [Jest](https://jestjs.io) API_. See [below](#providing-custom-spies) to use a different mock library.

Usage with [vue-test-utils](https://github.com/vuejs/vue-test-utils):

Given a component `MyComponent.vue`:

```vue
<template>
  <div>
    <p class="count">{{ count }}</p>
    <p class="doubleCount">{{ doubleCount }}</p>
    <button class="increment" @click="increment">+</button>
    <button class="decrement" @click="decrement">-</button>
    <hr />
    <button class="save" @click="save({ count })">Save</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount']),
  },
  methods: {
    ...mapMutations(['increment', 'decrement']),
    ...mapActions(['save']),
  },
}
</script>
```

You can test interactions without relying on the behaviour of your actions and mutations:

```js
import { Store } from 'vuex-mock-store'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

// create the Store mock
const store = new Store({
  state: { count: 0 },
  getters: { doubleCount: 0 },
})
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

  it('calls increment', () => {
    wrapper.find('button.increment').trigger('click')
    expect(store.commit).toHaveBeenCalledOnce()
    expect(store.commit).toHaveBeenCalledWith('increment')
  })

  it('dispatch save with count', () => {
    wrapper.find('button.save').trigger('click')
    expect(store.dispatch).toHaveBeenCalledOnce()
    expect(store.dispatch).toHaveBeenCalledWith('save', { count: 0 })
  })
})
```

⚠️ The mocked `dispatch` method returns `undefined` insteadf of a Promise. If you rely on this, you will have to call the appropriate function to make the `dispatch` spy return a Promise:

```js
store.dispatch.mockReturnValue(Promise.resolve(42))
```

If you are using Jest, you can check the documentation [here](https://jestjs.io/docs/en/mock-function-api#mockfnmockreturnvaluevalue)

### Initial state and getters

You can provide a `getters`, and `state` object to mock them:

```js
const store = new Store({
  getters: {
    name: 'Eduardo',
  },
  state: {
    counter: 0,
  },
})
```

### Modules

To mock module's `state`, simply provide a nested object for `state`:

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

To mock module's `getters`, provide the correct name when namespaced:

```js
new Store({
  getters: {
    'namespaced/getter': 'value',
    notNamespaced: 'value',
  },
})
```

Testing actions and mutations depend whether your [modules are namespaced](https://vuex.vuejs.org/guide/modules.html#namespacing) or not. If they are namespaced, make sure to provide the full action/mutation name:

```js
// namespaced module
expect(store.commit).toHaveBeenCalledWith('moduleA/setValue')
expect(store.dispatch).toHaveBeenCalledWith('moduleA/postValue')
// non-namespaced
expect(store.commit).toHaveBeenCalledWith('setValue')
expect(store.dispatch).toHaveBeenCalledWith('postValue')
```

### Mutating `state`, providing custom `getters`

You can [modify](#state) the `state` and `getters` directly for any test. Calling [`store.reset()`](#reset) will reset them to the initial values provided.

## API

### `Store` class

#### `constructor(options)`

- `options`
  - `state`: initial state object, _default_: `{}`
  - `getters`: getters object, _default_: `{}`
  - `spy`: interface to create spies. [details below](#providing-custom-spies)

#### `state`

Store state. You can directly modify it to change state:

```js
store.state.name = 'Jeff'
```

#### `getters`

Store getters. You can directly modify it to change a value:

```js
store.getters.upperCaseName = 'JEFF'
```

ℹ️ _Why no functions?_: if you provide a function to a getter, you're reimplementing it. During a test, you know the value, you should be able to provide it directly and be **completely sure** about the value that will be used in the component you are testing.

#### `reset`

Reset `commit` and `dispatch` spies and restore `getters` and `state` to their initial values

#### Providing custom spies

By default, the Store will call `jest.fn()` to create the spies. This will throw an error if you are using `mocha` or any other test framework that isn't Jest. In that situation, you will have to provide an interface to _create_ spies. This is the default interface that uses `jest.fn()`:

```js
new Store({
  spy: {
    create: handler => jest.fn(handler),
  },
})
```

The handler is an optional argument that mocks the implementation of the spy.

If you use Jest, you don't need to do anything.
If you are using something else like [Sinon](https://sinonjs.org), you could provide this interface:

```js
import sinon from 'sinon'

new Store({
  spy: {
    create: handler => sinon.spy(handler),
  },
})
```

### `commit` & `dispatch`

Spies. Dependent on the testing framework

- [jest.fn](https://jestjs.io/docs/en/jest-object#jestfnimplementation)
- [sinon.spy](https://sinonjs.org/releases/v6.3.4/spies)

## Related

- [vue-test-utils](https://github.com/vuejs/vue-test-utils)
- [vuex](https://github.com/vuejs/vuex)

## License

[MIT](http://opensource.org/licenses/MIT)

import 'jest'

type Dict = Record<string, any>

interface SpyCreator<S> {
  create: () => S
  reset: (spy: S) => any
}

interface StoreConstructorOptions<S extends Dict, G extends Dict, Spy> {
  getters?: G
  state?: S
  spy?: SpyCreator<Spy>
}

export class Store<S extends Dict = {}, G extends Dict = {}, Spy = jest.Mock> {
  commit: Spy
  dispatch: Spy
  state: S
  getters: G
  private _initialGetters: G
  private _initialState: S
  private _spy: SpyCreator<S>
  private _modulesNamespaceMap: any

  constructor(options?: StoreConstructorOptions<S, G, Spy>)

  reset(): void
  private _initialize(): void
}

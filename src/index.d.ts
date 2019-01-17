import 'jest'

type Dict = Record<string, any>

interface SpyCreator<S> {
  create: () => S
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
  private _spy: SpyCreator<Spy>
  private _modulesNamespaceMap: any
  private _mutationsHandlers: Function[]
  private _actionsHandlers: Function[]

  constructor(options?: StoreConstructorOptions<S, G, Spy>)

  reset(): void
  private _initialize(): void

  subscribe(handler: Function): () => void
  subscribeAction(handler: Function): () => void
  private _triggerMutationSubscriptions(type: string, payload: any): void
  private _triggerActionSubscriptions(type: string, payload: any): void
}

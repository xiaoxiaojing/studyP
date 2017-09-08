# dva
## dva-cli
* dva new
  - `--demo`: generate a dead simple project for quick prototype
* dva init
* dva generate(dva g)

## dva use extral plugin
* .roadhogrc

## routor config
* src/router.js
* src/routes/xx.js

## dva API
* `app=dva(opts)`: create app, and return dva instance(dva support multiple instances)
  - `opts` includes: `history`(default: `hashHistory`) and `initialState`(default: `{}`)
  - can configure hooks in opts
  ```
  const app = dva({
    history,
    initialState,
    onError, //`onError(fn, dispatch)`: Triggered when effect has error or subscription throw error with done
    onAction, //`onAction(fn |fn[])`: Triggered when action is dispatched
    onStateChange, //`onStateChange(fn)`: Triggered when state changes
    onReducer, //`onReducer(fn)`: Wrap reducer execute
    onEffect, //`onEffect(fn)`: Wrap effect execute
    onHmr, //`onHmr(fn)`
    extraReducers, //
    extraEnhancers,
  });
  ```
* `app.use(hooks)`: Specify hooks or register plugin
* `app.model(model)`: Register model
```
{
  namespace: 'NAMESPACE',
  state,
  reducers: {
    (state, action) => newState
  },
  effects: {
    *(action, effects) => void
  },
  subscriptions: {
    ({dispatch, history}, done) => unlistenFunction
  }
}
```
* `app.unmodel(namespace)`
* `app.router(({history, app})) => RouterConfig`
* `app.start(selector?)`
  - selector is optionally, if no selector, it will return a function which return JSX element

## services
* create a request

## utils
* request.js

## add UI

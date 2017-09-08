#react-router-redux
* Redux manage your application state
* React Router to do routing, controls the URL
* react-router-redux helps you keep that bit of state in sync with your Redux store

## How It Works
* It enhances a history instance
```
history + store(redux) -> react-router-redux -> enhanced history -> react-router
```

## Tutorial
1. a simple example
```
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="foo" component={Foo}/>
        <Route path="bar" component={Bar}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('mount')
)
```

2. watch for navigation events
  * use `history.listen`
  * listener function will receive a `location` any time the store updates

3. use the `Immutable.js`
  * https://github.com/reactjs/react-router-redux/issues/301

4. access router state in a container component
  * `props.location`

## Api
1. routerReducer()
  * must add this reducer to your store for syncing to work
  ```
  const store = createStore(
    combineReducers({
      ...reducers,
      routing: routerReducer
    })
  )
  ```
2. `history=syncHistoryWithStore(history, store, [options])`
  * create an enhanced history from the provided history
  * `options`:
    - `selectLocationState`
    - `adjustUrlOnReplay`
3. `push(location)`
4. `replace(location)`
5. `go(number)`
6. `goBack()`
7. `goForward`

2. routerMiddleware(history)
  * capture dispatched actions, and redirect those to the provided `history` instance.

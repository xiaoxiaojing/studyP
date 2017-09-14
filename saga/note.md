* https://zhuanlan.zhihu.com/p/23012870

# redux-saga
* `redux-saga` is a redux middleware
* it uses Generators
* An `Effects` is simply an object(plain JavaScript Object that yield from the Generator), It contains some information to be interpreted by the middleware

## usage
* the main.js file
```
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers'
import mySaga from './sagas'
//
// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
//
// mount it on the Store
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
//
// then run the saga, to start our Saga
sagaMiddleware.run(mySaga)
//
// render the application
```

* the sagas.js file
```
import { delay } from 'redux-saga'
import { put, takeEvery, all } from 'redux-saga/effects'
//
// Our worker Saga: will perform the async increment task
export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}
//
// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}
//
// single entry point to start all Sagas at once, they are started in parallel
export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}
```

## Using Saga Helpers
1. `take`:
  * create `command object` tells the middleware to wait for a specific action.
  * like to do :`action=getNextAction()`
2. `takeEvery`: is the most familiar and provides a behavior similar to `redux-thunk`
  * it allows multiple task to be started concurrently
  * use `takeEvery(*)` can catch all dispatched actions regardless of their types.
2. `takeLatest`: only get the response of the latest request fired
  * it allows only one task to run
  * previous running task will be cancelled when another task is started
3. `call`: `call(fn, ...args)`
  * create a description of the effect
  * the redux-saga middleware takes care of executing the function call and resuming the generator with the resolved response
  * use it we can easily test the logic
  * supports invoking object methods
    ```
    yield call([obj, obj.method], ..args)
    ```
  * can use it to invoke other Generator functions
4. `apply`: is an alias fro the `call`
  ```
  yield apply(obj, obj.method, [...args])
  ```
5. `cps`: be used to handle style functions
6. `put`: creates the dispatch Effect
  ```
  put({type, ...})
  ```
7. `fork`: express `non-blocking calls`
  * when we fork a task, the task is started in the background and the caller can continue its flow without waiting for the forked task to terminate
  * you can't catch errors from forked tasks.
8. `cancel`: cancel a forked task
9. `cancelled`: handle cancellation
10. `all`: executed tasks in Parallel
11. `race`:
  * offers a way of triggering a race between multiple Effects
  * it automatically cancels the loser Effects
12. `spawn`: used to create detached forks(`fork` is used to create attached forks)
13. `throttle(ms, pattern, saga, ...args)`:
  * spawns a saga on an action dispatched to the Store that matches `pattern`
14. `select`: get state
  * `const id = yield select(state => state.id)`

## Error handing
1. use `try/catch`
2. for test, use `throw` method of the Generator

## Composing sagas
* using `yield*` to composing Sagas, but it has some limitations:
  - test nested generators separately
  - allows only for sequential composition

## Task cancellation
* `yield cancel(task)`: once a task is forked, you can abort its execution
* `yield cancelled()`: check if the Generator has been cancelled or not
* Cancellation propagates downward(returned values and uncaught errors propagates upward)

## redux-saga's fork model
* you can dynamically fork tasks that execute in the background using 2 Effects
  - `fork`: is used to create attached forks
  - `spawn`: is used to create detached forks
* Attach forks (using `fork`)
  - A Saga terminates only after
    1. It terminates its own body of instructions
    2. All attached forks are themselves terminated
  - A Saga aborts as soon as
    1. Its main body of instructions throw an error
    2. An uncaught error was raised by one of its attached forks
* Detached forks (using `spawn`)
  - Detached forks live in their own execution context

## Concurrency
1. takeEvery
  * allows multiple saga tasks to be forked concurrently
  ```
  const takeEvery = (pattern, saga, ...args) => fork(function*() {
    while (true) {
      const action = yield take(pattern)
      yield fork(saga, ...args.concat(action))
      }
    })
  ```

2. takeLetest
  ```
  const takeLatest = (pattern, saga, ...args) => fork(function*() {
    let lastTask
    while (true) {
      const action = yield take(pattern)
      if (lastTask) {
        yield cancel(lastTask) // cancel is no-op if the task has already terminated
      }
      lastTask = yield fork(saga, ...args.concat(action))
    }
  })
  ```

## Test sagas
* Effects return plain javascript objects, it make testing very easy.
* test the different branches: `cloneableGenerator`

## Channel
1. `actionChannel` Effect:
  * queue all non-processed actions, and once we're done with processing the current request, we get the next message from the queue
2. `eventChannel` Effect:

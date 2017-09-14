* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
* https://github.com/ruanyf/es6tutorial/blob/gh-pages/docs/promise.md

# Promise
* The Promise object represents the eventual completion(or failure) of an asynchronous operation, and its resulting value.

## Syntax
```
const myPromise = new Promise(/* executor */ function(resolve, reject){
  // do something asynchronous with eventually calls either
  //
  //  resolve(someValue)  //fulfilled
  // or
  //  reject("failure reason") //rejected
})
```
* `executor` executed immediately by the Promise implementation(the executor is called before the Promise constructor even returns the created object)

## Description
1. A `Promise` is a **proxy** for a value not necessarily known when the promise is created
2. A `Promise` is in one of these states:
  * pending: initial state
  * fulfilled: meaning that the operation completed successfully
  * rejected: meaning that the operation failed
3. state change (A Promise is said to be settled if it is either fulfilled or rejected)
  * pending -> fulfilled
  * pending -> rejected
4. Promise的缺点
  * 无法取消Promise，一旦新建它就会立即执行
  * 不设置回调函数，Promise内部抛出的错误，不会反应到外部
  * 处于pending状态时，无法得知目前进展到哪个阶段
5. 基本用法
  * 调用resolve函数和reject函数时带有参数，它们的参数会被传递给回调函数
  * reject函数的参数通常是Error对象的实例，resolve函数的参数有：正常值和Promise实例
  ```
  // p1的状态会传递给p2，如果p1是Pending，那么p2的回调函数就会等待p1的状态改变，如果p1是Resolved或Rejected，那么p2的回调函数将立即执行
  var p1 = new Promise(function(resolve, reject){
    // ...
  });
  var p2 = new Promise(function(resolve, reject){
    // ...
    resolve(p1);
  })
  ```

## Properties
1. `Promise.length`: value is always 1 (number of constructor arguments)
2. `Promise.prototype`: Represents the prototype for the Promise constructor

## Methods
1. `Promise.all(iterable)`: `Promise.all([a1, a2, a3])`
  * be useful for aggregating results of multiple Promise and return a single Promise
    - when the returned Promise fulfills, it is fulfilled with an array of the values from the fulfilled promises in the same order as defined in the iterable
    - when the returned Promise rejects, it is rejected with the reason from the first promise in the iterable that rejected
  * the result is fulfulled when all promises in the iterable is fulfilled
2. `Promise.race(iterable)` ***
  * Returns a promise that fulfills or rejects as soon as one of the promises in the iterable fulfills or rejects, with the value or reason from that promise.
3. `Promise.reject(reason)`
  * return a Promise object that is rejected with the given reason
4. `Promise.resolve(value)`
  * return a Promise object that is resolve with the given value
  * 参数的四种情况：
    - 是一个Promise实例，原本地返回这个实例
    - 是一个thenable对象（具有then方法的对象），将这个对象转化为Promise对象，并立即执行thenable对象的then方法
    - 参数不是具有then方法的对象，或者是一个原始值，返回一个新的Promise对象，状态为Resolved
    - 不带任何参数，直接返回一个Resolved状态的Promise对象

## Promise.prototype
1. `Promise` instances inherit from `Promise.prototype`
2. `Promise.prototype.catch(onRejected)`
  * like the `Promise.prototype.then(undefined, onRejected)`
  * callback is a rejection handler, return value is a new Promise
  * 如果Promise状态已变成Resolved，再抛出错误是无效的
    ```
    var promise = new Promise(function(resolve, reject) {
      resolve("ok");
      throw new Error('test');
    });
    promise
      .then(function(value) { console.log(value) })
      .catch(function(error) { console.log(error) });
    // ok
    ```
  * Promise对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获位置。
3. `Promise.prototype.then(onFulfilled, onRejected)`
  * return a new Promise, if the handler function
    - return a value, the Promise is resolved, it's value is the return value
      ```
      var p2 = new Promise(function(resolve, reject) {
        resolve(1);
      });
      p2.then(function(value) {
        console.log(value); // 1
      });
      ```
    - return an error, the Promise is rejected, it's value is the thrown error
      ```
      Promise.resolve()
        .then( () => {
          // Makes .then() return a rejected promise
          throw 'Oh no!';
        })
        .then( () => {
          console.log( 'Not called.' );
        }, reason => {
          console.error( 'onRejected function called: ', reason );
        });
      Promise.reject()
        .then( () => 99, () => 42 ) // onRejected returns 42 which is wrapped in a resolving Promise
        .then( solution => console.log( 'Resolved with ' + solution ) ); // Resolved with 42
      ```
    - return an already resolved promise or already rejected promise, the Promise is resolved, it's value is the promise's value

    - return another pending promise, 会等待该promise对象的状态发生变化。it's value is the promise's value
  * 作用：为Promise实例添加状态改变时的回调函数

## 扩展
1. done()方法：处于回调链尾端，保证抛出任何可能出现的错误。
  ```
  Promise.prototype.done = function(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
      .catch(function(reason){
        //抛出一个全局错误
        setTimeout(()=>{throw reason}, 0)
      })
  }
  ```
2. finally()方法：指定不管Promise对象最后状态如何，都会执行的操作
  ```
  Promise.prototype.finally = function (callback) {
    let p = this.constructor
    return this.then (
      value => p.resolve(callback()).then(()=>value),
      reason => p.resolve(callback()).then(()=>{throw reason})
    )
  }
  ```

## 应用
1. 加载图片
```
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```

2. Generator函数和Promise的结合
3. async函数

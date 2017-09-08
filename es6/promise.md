# Promise
* The Promise object represents the eventual completion(or failure) of an asynchronous operation, and its resulting value.

## Syntax
```
new Promise(/* executor */ function(resolve, reject){....})
```
1. Parameters
  * `executor`
    - is a function
    - has arguments `resolve` and `reject`
    - executed immediately by the Promise implementation(the executor is called before the Promise constructor even returns the created object)
    - do asynchronous

## Description
1. A `Promise` is a **proxy** for a value not necessarily known when the promise is created
2. A `Promise` is in one of these states:
  * pending: initial state
  * fulfilled: meaning that the operation completed successfully
  * rejected: meaning that the operation failed

## Properties
1. `Promise.length`: value is always 1 (number of constructor arguments)
2. `Promise.prototype`: Represents the prototype for the Promise constructor

## Methods
1. `Promise.all(iterable)`:
  * be useful for aggregating results of multiple Promise and return a Promise
    - when the returned Promise fulfills, it is fulfilled with an array of the values from the fulfilled promises in the same order as defined in the iterable
    - when the returned Promise rejects, it is rejected with the reason from the first promise in the iterable that rejected
  * the result is fulfulled when all promises in the iterable is fulfilled
2. `Promise.race(iterable)`
  * Returns a promise that fulfills or rejects as soon as one of the promises in the iterable fulfills or rejects, with the value or reason from that promise.
3. `Promise.reject(reason)`
  * return a Promise object that is rejected with the given reason
4. `Promise.resolve(value)`
  * return a Promise object that is resolved with the given value

## Promise.prototype
1. `Promise.prototype.catch(onRejected)`
2. `Promise.prototype.then(onFulfilled, onRejected)`
  * 

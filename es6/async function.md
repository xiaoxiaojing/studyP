* https://github.com/ruanyf/es6tutorial/blob/gh-pages/docs/async.md
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

# async function
* The async function declaration defines an asynchronous function, which return an AsyncFunction Object

## Syntax
```
async function name(param, [, param[, ...param]]) {
  statements
}
```

## Description
* when an async function is called, it returns a Promise.
* can contain an `await` expression.

## 对比async和Generator, async函数
1. 内置执行器，执行async函数和普通函数调用一样
2. 使用async和await，语义更清楚
3. yield命令后面只能是thunk函数或者Promise对象。await还可以是原始类型的值
4. async函数的返回值是Promise对象，Generator函数的返回值是Iterable对象

## 基本用法
1. async函数返回一个Promise对象，可以使用then方法添加回调函数
```
async function getStockPriceByName(name) {
  var symbol = await getStockSymbol(name);
  var stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});
```

2. async函数的多种使用形式
```
//函数声明
async function foo() {}
//函数表达式
const foo = async function () {}
//对象的方法
let obj = {
  async foo () {}
}
obj.foo().then(...)
//class的方法
class ClassName {
  async Func(param) {
    ...
  }
}
//箭头函数
const foo = async () => {};
```

## 语法
1. async函数返回一个Promise对象。如果函数内部抛出错误，会导致返回后的Promise对象变为reject状态
2. Promise对象的状态变化
  * async函数返回的Promise对象，必须等到内部所有await命令后面的Promise对象执行完，才会发生状态改变，除非遇到return语句或者是抛出错误
3. await命令
  * 命令后面是一个Promise对象
  * 如果不是Promise对象，会被转化为一个立即resolve的Promise对象
  * 命令后面的Promise对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到
  * 只要await后的Promise变为reject，整个async函数都会中断执行，解决中断的方法有以下：
    - 将会出错的语句放在try...catch中
    - 在会出错的语句后边跟一个catch方法

还没有看完。。。

0. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
1. generator function: `function*` defines a generator function, which returns a Generator object
2. Generators:
  * are functions
  * can be exited and later re-entered
  * Their context(variable bindings) will be saved across re-entrances.
3. generator function
  * calling a generator function does note execute its body immediately, an iterator object for the function is returned instead. When the iterator's next() method is called, the generator function's body is executed until the first yield expression, which specifies the value to be returned from the iterator or, with yield*, delegates to another generator function.
4. yield: The yield keyword is used to pause and resume a generator function
5. yield*: the yield* expression is used to delegate to another generator or iterable object

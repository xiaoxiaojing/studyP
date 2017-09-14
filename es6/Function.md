## `Function.prototype.bind()`
1. Syntax
  `fun.bind(thisArg[, arg1[, arg2[, ...]]])`
  * thisArg:
    - as the `this`
    - be ignored if the bound function is constructed using the `new` operator
  * arg1, arg2, ...
    - these to prepend to arguments

2. Examples
  * Creating a bound function
    ```
    this.x = 9
    var module = {x: 81, getX: function(){return this.x}}
    module.getX() // 81
    var globalModule = module.getX;
    globalModule() // 9
    var boundModule = globalModule.bind(module)
    boundModule() // 81
    ```
  * Partially applied functions
    - make a function withe pre-specified initial arguments
    ```
    function list() {
      return Array.prototype.slice.call(arguments)
    }
    var list1 = list(1,2,3) //[1,2,3]
    var leadingThirtysevenList = list.bind(null, 37)
    var list2 = leadingThirtysevenList() //[37]
    var list3 = leadingThirtysevenList(1,2,3) //[37,1,2,3]
    ```
  * With SetTimeout
    - By default within `window.setTimeout()`, the `this` keyword will be set to the `window`.
    - use bind to set `this`

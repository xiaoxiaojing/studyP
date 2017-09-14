## 调用步骤
1. initialize：
```
const app = dva({
  history,
  onError
})
```

2. add Plugin
```
app.use()
```

3. add router and model
```
app.router()
```

4. start
```
app.start('#root')
```

## 入口(`src/dva/index.js`)
1. 对外暴露一个函数(`dva`)
  * 接收一个参数（`opts`）
    ```
    opts = {
      history,
      onError,
      ...
    }
    ```
  * 返回一个对象（`app`）

2. 创建app
  * core.create：返回一个app
  * 设置app.router（必须是一个函数）
  * 存储原本的app.start为oldAppStart，并重新设置app.start
3. start的逻辑
  * 路由必须提前注册，即app._router存在时才能继续执行oldAppStart
  * 开始渲染

2. 几个问题
  * patchHistory的原理
  * createElement的参数问题

## 创建app (`src/dva-core/index.js`)
1. 对外暴露一个函数(`create`)
  * 接收两个参数（`hooksAndOpts`, `createOpts`)
    - hooksAndOpts：是外部传进来的参数
      `hooksAndOpts={history, onError,...}`
    - createOpts：是在`dva/index.js`中创建的
      ```
      createOpts = {
        initialReducer: {routing}
        setupMiddlewares(middleware) {...}
        setupApp(app){...}
      }
      ```
  * 返回一个对象（`app`）
    ```
    {
      _models: [...], //加过前缀的models
      _store,
      _plugin: {
        use,
        apply,
        get
      },
      use,
      model,
      start
    }
    ```


### `src/dva-core/Plugin.js`
1. 有一个私有常量 hooks
2. 暴露了一个类Plugin和一个函数filterHooks
  * filterHooks: 过滤obj，使其只保留key值是hooks中的属性的项目
3. 类Plugin的逻辑
  * 初始化：this.hooks
  * 内部有三个私有函数：use、apply、get，这个三个私有函数，都会使用到this.hooks

### `src/dva-core/prefixNamespace.js`
1. 暴露一个函数`prefixNamespace`
  * 接收一个参数`model`
  * 作用：给传入的model的reducers和effects的所有属性加上前缀

### `src/dva-core/checkModel.js`
1. 暴露一个函数`checkModel`，用于检查model是否合法
2. model必须满足一下条件
  * 必须定义namespace，且namespace必须是String，且唯一
  * 如果定义了reducers， 它必须是一个数组或者对象，如果是数组必须是[Object, Function]的格式
  * 如果定义了effects，它必须为一个对象
  * 如果定义了subscriptions, 它必须是一个对象且属性值必须是函数

### `src/dva-core/prefixType.js`
1. 暴露一个函数`prefixType`，返回加上前缀的type

### `src/dva-core/getSaga.js`
1. 返回一个函数`getSaga`
  * 接收参数：resolve, reject, effects, model, onError, onEffect
  * 返回值是一个Generator
2. `getWatcher()`

### `src/dva-core/getReducer.js`
### `src/dva-core/handleActions.js`
1. 暴露了一个函数`handleActions`
  * 接收参数 `handlers, defaultState`, 他们都是对象
2. `handleAction`
  * 通过闭包存储了两个遍历actionType和reducer
  * 返回了一个新的函数 (state, action) => newState
3. `reduceReducers`
  * 通过闭包存储了遍历reducers
  * 返回一个新的函数 (previous, current) => {//依次执行所有的reducers}

import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga/lib/internal/middleware';
import invariant from 'invariant';
import checkModel from './checkModel';
import prefixNamespace from './prefixNamespace';
import Plugin, { filterHooks } from './Plugin';
import createStore from './createStore';
import getSaga from './getSaga';
import getReducer from './getReducer';
import createPromiseMiddleware from './createPromiseMiddleware';
import {
  run as runSubscription,
  unlisten as unlistenSubscription,
} from './subscription';
import { noop } from './utils';

// Internal model to update global state when do unmodel
const dvaModel = {
  namespace: '@@dva',
  state: 0,
  reducers: {
    UPDATE(state) { return state + 1; },
  },
};

/**
 * Create dva-core instance.
 *
 * @param hooksAndOpts
 * @param createOpts
 */
export function create(hooksAndOpts = {}, createOpts = {}) {
  const {
    initialReducer,
    setupApp = noop,
  } = createOpts;

  const plugin = new Plugin();
  plugin.use(filterHooks(hooksAndOpts));

  const app = {
    _models: [ //_models 是一个数组，每一项值是一个加过前缀的model
      prefixNamespace({ ...dvaModel }),
    ],
    _store: null,
    _plugin: plugin,
    use: plugin.use.bind(plugin), //为什么要用bind(plugin)??
    model,
    start,
  };
  return app;

  /**
   * Register model before app is started.
   *
   * @param m {Object} model to register
   */
  function model(m) {
    if (process.env.NODE_ENV !== 'production') {
      // 检查model是否符合规范
      checkModel(m, app._models);
    }

    // 给所有的modal加前缀，并push到_models中
    app._models.push(prefixNamespace(m));
  }

  /**
   * Inject model after app is started.
   *
   * @param createReducer
   * @param onError
   * @param unlisteners
   * @param m
   */
  function injectModel(createReducer, onError, unlisteners, m) {
    model(m);

    const store = app._store;
    if (m.reducers) {
      store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state);
      store.replaceReducer(createReducer(store.asyncReducers));
    }
    if (m.effects) {
      store.runSaga(app._getSaga(m.effects, m, onError, plugin.get('onEffect')));
    }
    if (m.subscriptions) {
      unlisteners[m.namespace] = runSubscription(m.subscriptions, m, app, onError);
    }
  }

  /**
   * Unregister model.
   *
   * @param createReducer
   * @param reducers
   * @param unlisteners
   * @param namespace
   *
   * Unexpected key warn problem:
   * https://github.com/reactjs/redux/issues/1636
   */
  function unmodel(createReducer, reducers, unlisteners, namespace) {
    const store = app._store;

    // Delete reducers
    delete store.asyncReducers[namespace];
    delete reducers[namespace];
    store.replaceReducer(createReducer());
    store.dispatch({ type: '@@dva/UPDATE' });

    // Cancel effects
    store.dispatch({ type: `${namespace}/@@CANCEL_EFFECTS` });

    // Unlisten subscrioptions
    unlistenSubscription(unlisteners, namespace);

    // Delete model from app._models
    app._models = app._models.filter(model => model.namespace !== namespace);
  }

  /**
   * Start the app.
   *
   * @returns void
   */
  function start() {
    // Global error handler
    const onError = (err) => {
      if (err) {
        // 如果err是一个错误字符串，创建了一个错误实例
        if (typeof err === 'string') err = new Error(err);

        // const errorHander = (err) => {
        //   throw new Error(err.stack || err)
        // }
        // plugin.apply('onError', errorHander)(err, app_store.dispatch)

        plugin.apply('onError', (err) => {
          throw new Error(err.stack || err);
        })(err, app._store.dispatch);
      }
    };

    /**创建一个saga中间件，这个中间件会被redux的createStore用到，例如
        const store = createStore(
          reducer,
          applyMiddleware(sagaMiddleware)
        )
    **/
    const sagaMiddleware = createSagaMiddleware();

    //创建Promise Middleware
    const {
      middleware: promiseMiddleware,
      resolve,
      reject,
    } = createPromiseMiddleware(app);

    // 设置 app._getSaga，指定了前两个参数为resolve和reject
    app._getSaga = getSaga.bind(null, resolve, reject);

    const sagas = [];
    const reducers = { ...initialReducer };

    // 遍历model初始化reducer,sagas
    for (const m of app._models) {
      //获取reducers：是一个函数
      reducers[m.namespace] = getReducer(m.reducers, m.state);
      //如果是effects，设置sagas
      if (m.effects) sagas.push(app._getSaga(m.effects, m, onError, plugin.get('onEffect')));
    }
    const reducerEnhancer = plugin.get('onReducer');
    const extraReducers = plugin.get('extraReducers');
    invariant(
      Object.keys(extraReducers).every(key => !(key in reducers)),
      `[app.start] extitraReducers is conflict with other reducers, reducers list: ${Object.keys(reducers).join(', ')}`,
    );

    // Create store
    const store = app._store = createStore({ // eslint-disable-line
      reducers: createReducer(),
      initialState: hooksAndOpts.initialState || {},
      plugin,
      createOpts,
      sagaMiddleware,
      promiseMiddleware,
    });

    // Extend store
    store.runSaga = sagaMiddleware.run;
    store.asyncReducers = {};

    // Execute listeners when state is changed
    const listeners = plugin.get('onStateChange');
    for (const listener of listeners) {
      store.subscribe(() => {
        listener(store.getState());
      });
    }

    // Run sagas
    sagas.forEach(sagaMiddleware.run);

    // Setup app
    setupApp(app);

    // Run subscriptions
    const unlisteners = {};
    for (const model of this._models) {
      if (model.subscriptions) {
        unlisteners[model.namespace] = runSubscription(model.subscriptions, model, app, onError);
      }
    }

    // Setup app.model and app.unmodel
    app.model = injectModel.bind(app, createReducer, onError, unlisteners);
    app.unmodel = unmodel.bind(app, createReducer, reducers, unlisteners);

    /**
     * Create global reducer for redux.
     *
     * @returns {Object}
     */
    function createReducer() {
      return reducerEnhancer(combineReducers({
        ...reducers,
        ...extraReducers,
        ...(app._store ? app._store.asyncReducers : {}),
      }));
    }
  }
}

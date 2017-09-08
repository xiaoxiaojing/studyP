import React from 'react';
// use to write error message
import invariant from 'invariant';
// use to keep track of history
import createHashHistory from 'history/createHashHistory';
import {
  routerMiddleware,
  routerReducer as routing,
} from 'react-router-redux';
import document from 'global/document';
import { Provider } from 'react-redux';
import * as core from 'dva-core';
import { isFunction } from 'dva-core/lib/utils';

/**
 * 返回一个对象，app = dva({history: browserHistory})
 * @param  {Object} [opts={}]
 * @return {Object}
 */
export default function (opts = {}) {
  // get history
  const history = opts.history || createHashHistory();

  // set the options
  const createOpts = {
    initialReducer: {
      routing, //使用react-route-redux必须添加上这个reducer，且key的命名为routing
    },
    //创建中间件
    setupMiddlewares(middlewares) {
      return [
        routerMiddleware(history), //react-route-redux使用的一个middleware，用于capture dispatched actions
        ...middlewares,
      ];
    },
    //扩展app, 添加_history属性
    setupApp(app) {
      app._history = patchHistory(history);
    },
  };

  const app = core.create(opts, createOpts);
  const oldAppStart = app.start;
  app.router = router;
  app.start = start;
  return app;

  /**
   * 判断传入的router是否是一个函数，并设置app._router的值
   * @param  {Function} router
   */
  function router(router) {
    invariant(
      isFunction(router),
      `[app.router] router should be function, but got ${typeof router}`,
    );
    app._router = router;
  }


  function start(container) {
    // 允许 container 是字符串，然后用 querySelector 找元素
    if (isString(container)) {
      container = document.querySelector(container);
      invariant(
        container,
        `[app.start] container ${container} not found`,
      );
    }

    // 并且是 HTMLElement
    invariant(
      !container || isHTMLElement(container),
      `[app.start] container should be HTMLElement`,
    );

    // 路由必须提前注册
    invariant(
      app._router,
      `[app.start] router must be registered before app.start()`,
    );

    oldAppStart.call(app);

    //获取store
    const store = app._store;

    // export _getProvider for HMR
    // ref: https://github.com/dvajs/dva/issues/469
    app._getProvider = getProvider.bind(null, store, app);

    // If has container, render; else, return react component
    if (container) {
      render(container, store, app, app._router);
      app._plugin.apply('onHmr')(render.bind(null, container, store, app));
    } else {
      return getProvider(store, this, this._router);
    }
  }
}

function isHTMLElement(node) {
  return typeof node === 'object' && node !== null && node.nodeType && node.nodeName;
}

function isString(str) {
  return typeof str === 'string';
}

function getProvider(store, app, router) {
  return extraProps => (
    <Provider store={store}>
      { router({ app, history: app._history, ...extraProps }) }
    </Provider>
  );
}

function render(container, store, app, router) {
  const ReactDOM = require('react-dom');  // eslint-disable-line
  ReactDOM.render(React.createElement(getProvider(store, app, router)), container);
}

function patchHistory(history) {
  const oldListen = history.listen;
  history.listen = (callback) => {
    callback(history.location);
    oldListen.call(history, callback);
  };
  return history;
}

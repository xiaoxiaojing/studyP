import { NAMESPACE_SEP } from './constants';

/**
 * 创建promise middleware
 * @param  {Object} app dva实例
 * @return {Object}     {
 *         middleware: promiseMiddleware,
 *         resolve,
 *         reject,
 * }
 */
export default function createPromiseMiddleware(app) {
  const map = {};

  /*
  const middleware = function () {
    return function (next) {
      return function(action) {
        if ...
          return new Promise()
        else ...
          return next(action)
      }
    }
  }*/

  // redux中间件的写法
  const middleware = () => next => (action) => {
    // 从action中取得type
    const { type } = action;

    if (isEffect(type)) {
      // 如果是异步操作就新建一个Promise
      return new Promise((resolve, reject) => {
        map[type] = {
          resolve: wrapped.bind(null, type, resolve),
          reject: wrapped.bind(null, type, reject),
        };
      });
    } else {
      return next(action);
    }
  };

  /**
   * 判断是否是Effect
   * @param  {String}  type
   * @return {Boolean}
   */
  function isEffect(type) {
    // 取得namespace
    const [namespace] = type.split(NAMESPACE_SEP);
    // 取得对应namespaace的model
    const model = app._models.filter(m => m.namespace === namespace)[0];
    if (model) {
      if (model.effects && model.effects[type]) {
        return true;
      }
    }

    return false;
  }

  function wrapped(type, fn, args) {
    if (map[type]) delete map[type];
    fn(args);
  }

  function resolve(type, args) {
    if (map[type]) {
      map[type].resolve(args);
    }
  }

  function reject(type, args) {
    if (map[type]) {
      map[type].reject(args);
    }
  }

  return {
    middleware,
    resolve,
    reject,
  };
}

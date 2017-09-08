import invariant from 'invariant';
import { isPlainObject } from './utils';

const hooks = [
  'onError',
  'onStateChange',
  'onAction',
  'onHmr',
  'onReducer',
  'onEffect',
  'extraReducers',
  'extraEnhancers',
];

// 唯一化hook
export function filterHooks(obj) {
  return Object.keys(obj).reduce((memo, key) => {
    if (hooks.indexOf(key) > -1) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
}

export default class Plugin {
  constructor() {
    /**
     * 将hooks转为一个对象并初始化每一个key的值
     *  {
     *   onError: [],
     *   onStateChange: [],
     *   onAction: [],
     *   onHmr: [],
     *   onReducer: [],
     *   onEffect: [],
     *   extraReducers: [],
     *   extraEnhancers: []
     *  }
     */
    this.hooks = hooks.reduce((memo, key) => {
      memo[key] = [];
      return memo;
    }, {});
  }

  use(plugin) {
    invariant(isPlainObject(plugin), 'plugin.use: plugin should be plain object');
    const hooks = this.hooks;
    // 用plugin设置hooks中的属性值
    for (const key in plugin) {
      // guaranteed only the keys that are on that object intance itself!!!!
      if (Object.prototype.hasOwnProperty.call(plugin, key)) {
        invariant(hooks[key], `plugin.use: unknown plugin property: ${key}`);
        if (key === 'extraEnhancers') {
          hooks[key] = plugin[key];
        } else {
          hooks[key].push(plugin[key]);  //???
        }
      }
    }
  }

  // 执行回调函数
  apply(key, defaultHandler) {
    const hooks = this.hooks;
    const validApplyHooks = ['onError', 'onHmr'];
    invariant(validApplyHooks.indexOf(key) > -1, `plugin.apply: hook ${key} cannot be applied`);
    const fns = hooks[key];

    return (...args) => {
      if (fns.length) { // 如果hooks中有这个回调，执行每一个回调数组中的每个值
        for (const fn of fns) {
          fn(...args);
        }
      } else if (defaultHandler) { // 如果没有设置回调函数，就执行默认的
        defaultHandler(...args);
      }
    };
  }

  // 获取hooks中的属性值
  get(key) {
    const hooks = this.hooks;
    invariant(key in hooks, `plugin.get: hook ${key} cannot be got`);
    if (key === 'extraReducers') {
      return getExtraReducers(hooks[key]);
    } else if (key === 'onReducer') {
      return getOnReducer(hooks[key]);
    } else {
      return hooks[key];
    }
  }
}

function getExtraReducers(hook) {
  let ret = {};
  for (const reducerObj of hook) {
    ret = { ...ret, ...reducerObj };
  }
  return ret;
}

function getOnReducer(hook) {
  return function (reducer) {
    for (const reducerEnhancer of hook) {
      reducer = reducerEnhancer(reducer);
    }
    return reducer;
  };
}

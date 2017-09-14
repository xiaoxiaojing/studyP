import invariant from 'invariant';
import * as sagaEffects from 'redux-saga/effects';
import warning from 'warning';
import {
  takeEveryHelper as takeEvery,
  takeLatestHelper as takeLatest,
  throttleHelper as throttle,
} from 'redux-saga/lib/internal/sagaHelpers';
import { NAMESPACE_SEP } from './constants';
import prefixType from './prefixType';

export default function getSaga(resolve, reject, effects, model, onError, onEffect) {
  return function *() {
    // 遍历effects的属性
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {

        //
        const watcher = getWatcher(resolve, reject, key, effects[key], model, onError, onEffect);

        const task = yield sagaEffects.fork(watcher);
        yield sagaEffects.fork(function *() {
          yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`);
          yield sagaEffects.cancel(task);
        });
      }
    }
  };
}

//返回一个saga
function getWatcher(resolve, reject, key, _effect, model, onError, onEffect) {
  let effect = _effect;
  let type = 'takeEvery';
  let ms;

  // 如果_effect是个数组
  // [
  //  effect,
  //  opts:{
  //    type, //type的值只能是['watcher', 'takeEvery', 'takeLatest', 'throttle']其中的一个
  //    ms
  //  }
  // ]
  if (Array.isArray(_effect)) {
    effect = _effect[0];
    const opts = _effect[1];
    if (opts && opts.type) {
      type = opts.type;
      if (type === 'throttle') {
        invariant(
          opts.ms,
          'app.start: opts.ms should be defined if type is throttle',
        );
        ms = opts.ms;
      }
    }
    invariant(
      ['watcher', 'takeEvery', 'takeLatest', 'throttle'].indexOf(type) > -1,
      'app.start: effect type should be takeEvery, takeLatest, throttle or watcher',
    );
  }

  // 这里的effect变量是一个函数
  function *sagaWithCatch(...args) {
    try {
      // start
      yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@start` });
      // 执行effect
      const ret = yield effect(...args.concat(createEffects(model)));
      // end
      yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@end` });
      // 异步操作effect执行成功后，调用resolve
      resolve(key, ret);
    } catch (e) {
      onError(e);
      reject(key, e);
    }
  }

  const sagaWithOnEffect = applyOnEffect(onEffect, sagaWithCatch, model, key);

  switch (type) {
    case 'watcher':
      return sagaWithCatch;
    case 'takeLatest':
      return function*() {
        yield takeLatest(key, sagaWithOnEffect);
      };
    case 'throttle':
      return function*() {
        yield throttle(ms, key, sagaWithOnEffect);
      };
    default:
      return function*() {
        yield takeEvery(key, sagaWithOnEffect);
      };
  }
}

//创建一系列Effect
function createEffects(model) {
  function assertAction(type, name) {
    invariant(type, 'dispatch: action should be a plain Object with type');
    warning(
      type.indexOf(`${model.namespace}${NAMESPACE_SEP}`) !== 0,
      `[${name}] ${type} should not be prefixed with namespace ${model.namespace}`,
    );
  }
  function put(action) {
    const { type } = action;
    assertAction(type, 'sagaEffects.put');
    return sagaEffects.put({ ...action, type: prefixType(type, model) });
  }
  function take(type) {
    if (typeof type === 'string') {
      assertAction(type, 'sagaEffects.take');
      return sagaEffects.take(prefixType(type, model));
    } else {
      return sagaEffects.take(type);
    }
  }
  return { ...sagaEffects, put, take };
}

function applyOnEffect(fns, effect, model, key) {
  for (const fn of fns) {
    effect = fn(effect, sagaEffects, model, key);
  }
  return effect;
}

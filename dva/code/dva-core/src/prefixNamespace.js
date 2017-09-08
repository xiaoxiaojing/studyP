import warning from 'warning';
import { isArray } from './utils';
import { NAMESPACE_SEP } from './constants';

// 给对象的每个属性的key添加前缀 `${namespace}${NAMESPACE_SEP}`
function prefix(obj, namespace, type) {
  return Object.keys(obj).reduce((memo, key) => {
    warning(
      key.indexOf(`${namespace}${NAMESPACE_SEP}`) !== 0,
      `[prefixNamespace]: ${type} ${key} should not be prefixed with namespace ${namespace}`,
    );
    const newKey = `${namespace}${NAMESPACE_SEP}${key}`;
    memo[newKey] = obj[key];
    return memo;
  }, {});
}

//给modal的reducer和effect的属性的key添加前缀
export default function prefixNamespace(model) {
  const {
    namespace,
    reducers,
    effects,
  } = model;

  if (reducers) {
    // 如果reducer是数组，取数组第一项，给数组第一项（是个对象）添加前缀
    if (isArray(reducers)) {
      model.reducers[0] = prefix(reducers[0], namespace, 'reducer');
    } else {
      model.reducers = prefix(reducers, namespace, 'reducer');
    }
  }
  if (effects) {
    model.effects = prefix(effects, namespace, 'effect');
  }
  return model;
}

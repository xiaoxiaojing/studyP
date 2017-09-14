import { NAMESPACE_SEP } from './constants';

export default function prefixType(type, model) {
  //使用namespace和type构造出model的真实key
  const prefixedType = `${model.namespace}${NAMESPACE_SEP}${type}`;
  const typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, '');
  //如果key存在，返回真实key
  if ((model.reducers && model.reducers[typeWithoutAffix])
    || (model.effects && model.effects[typeWithoutAffix])) {
    return prefixedType;
  }
  //如果不存在返回type（如，subscription中的key没有加前缀）
  return type;
}

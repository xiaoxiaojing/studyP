function identify(value) {
  return value;
}
/**
 * 返回一个函数 (state, action) => newState
 * @param  {String} actionType
 * @param  {Function} [reducer=identify]
 * @return {Function}
 */
function handleAction(actionType, reducer = identify) {
  return (state, action) => {
    const { type } = action;
    if (type && actionType !== type) {
      return state;
    }
    return reducer(state, action);
  };
}

/**
 * 返回一个函数 (previous, current) => {}
 * @param  {Object} reducers {type: function, ...,}
 * @return {Function}
 */
function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce(
      (p, r) => r(p, current),
      previous,
    );
}

/**
 * 返回一个函数 (state, action) => {//执行reducer}
 * @param  {Object} handlers        {key: Function, ....}
 * @param  {Object} defaultState    {key: value}
 * @return {Function}
 */
function handleActions(handlers, defaultState) {
  //将handlers转化为一个数组，数组元素是函数 [(state, action)=> newState, ...]
  const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type]));
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}

export default handleActions;

import handleActions from './handleActions';

/**
 * 返回一个函数 (state, action) => newState
 * @param  {Object} reducers {key:Function, ...,}
 * @param  {Object} state
 * @return {[type]}          [description]
 */
export default function getReducer(reducers, state) {
  // Support reducer enhancer
  // e.g. reducers: [realReducers, enhancer]
  if (Array.isArray(reducers)) {
    return reducers[1](handleActions(reducers[0], state));
  } else {
    return handleActions(reducers || {}, state);
  }
}

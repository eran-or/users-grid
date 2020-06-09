import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import {userReducer} from './reducers/userReducer'
import thunk from 'redux-thunk'

const middlewares = [thunk]
export default () => {
  const store = createStore(
    combineReducers({
      users: userReducer
    }),
    compose(
      applyMiddleware(
        ...middlewares
      ),(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
  );
  return store;
};
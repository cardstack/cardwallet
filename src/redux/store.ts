import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

const enableReduxFlipper = false;

const middlewares = [thunk];

if (__DEV__ && enableReduxFlipper) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger({ resolveCyclic: true }));
}

const store = createStore(reducers, applyMiddleware(...middlewares));

export default store;

export type RootState = ReturnType<typeof reducers>;
export type AppState = ReturnType<typeof store.getState>;
export type AppGetState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

const enableReduxFlipper = false;
const enableReduxLogger = false;

// Ignoring types, bc it's just a debug helper
const reduxLogger = (store: any) => (next: any) => (action: any) => {
  const reducersKeys = Object.keys(reducers);

  // We can specify which keys to log  or log all
  const singleKeys: string[] = ['wallets', 'appState'];
  const stateKeys = singleKeys.length ? singleKeys : reducersKeys;

  console.info('dispatching', JSON.stringify(action));
  let result = next(action);

  stateKeys.forEach(key => {
    console.log(`${key} state`, JSON.stringify(store.getState()?.[key]));
  });

  return result;
};

const configureStore = () => {
  const middlewares = [thunk];

  if (__DEV__) {
    enableReduxLogger && middlewares.push(reduxLogger as any);

    if (enableReduxFlipper) {
      const createDebugger = require('redux-flipper').default;
      middlewares.push(createDebugger({ resolveCyclic: true }));
    }
  }

  return createStore(reducers, applyMiddleware(...middlewares));
};

const store = configureStore();

export default store;

export type RootState = ReturnType<typeof reducers>;
export type AppState = ReturnType<typeof store.getState>;
export type AppGetState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;

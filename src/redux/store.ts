import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import thunk from 'redux-thunk';

import reducers from './reducers';
import { safesApi } from '@cardstack/services';

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

const store = configureStore({
  reducer: {
    ...reducers,
    [safesApi.reducerPath]: safesApi.reducer,
  },
  middleware: () => {
    const debugMiddlewares = [];

    if (__DEV__) {
      enableReduxLogger && debugMiddlewares.push(reduxLogger as any);

      if (enableReduxFlipper) {
        const createDebugger = require('redux-flipper').default;
        debugMiddlewares.push(
          createDebugger({
            resolveCyclic: true,
          })
        );
      }
    }

    return [thunk, safesApi.middleware, ...debugMiddlewares];
  },
});

setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppGetState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;

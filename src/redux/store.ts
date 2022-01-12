import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import reducers from './reducers';
import { safesApi } from '@cardstack/services/safes-api';
import { serviceStatusApi } from '@cardstack/services/service-status-api';

const enableReduxFlipper = true;

const store = configureStore({
  reducer: {
    ...reducers,
    [safesApi.reducerPath]: safesApi.reducer,
    [serviceStatusApi.reducerPath]: serviceStatusApi.reducer,
  },
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false, // we are currently storing some non-serializable objects in the store including wallet connect objects. it would be nice to fix this.
      immutableCheck: false, // without disabling this, we get a max call stack exceeded when switching from mainnet to xdai. It is likely due to storing an object in redux that has a circular reference to itself.
    });
    middlewares.push(safesApi.middleware);
    middlewares.push(serviceStatusApi.middleware);

    if (__DEV__) {
      if (enableReduxFlipper) {
        const createDebugger = require('redux-flipper').default;
        middlewares.push(
          createDebugger({
            resolveCyclic: true,
          })
        );
      }
    }
    return middlewares;
  },
});

setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppGetState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;

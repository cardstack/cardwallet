import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { persistReducer, persistStore } from 'redux-persist';
import reducers from './reducers';
import { authSlice } from '@cardstack/redux/authSlice';
import { biometryToggleSliceName } from '@cardstack/redux/biometryToggleSlice';
import { primarySafeSliceName } from '@cardstack/redux/primarySafeSlice';
import { welcomeBannerSliceName } from '@cardstack/redux/welcomeBanner';
import { hubApi } from '@cardstack/services/hub/hub-api';
import { safesApi } from '@cardstack/services/safes-api';
import { serviceStatusApi } from '@cardstack/services/service-status-api';

const enableReduxFlipper = true;

const persistConfig = {
  key: 'persist',
  version: 1,
  storage: AsyncStorage,
  whitelist: [
    primarySafeSliceName,
    biometryToggleSliceName,
    welcomeBannerSliceName,
  ],
};

const rootReducer = combineReducers({
  ...reducers,
  [safesApi.reducerPath]: safesApi.reducer,
  [hubApi.reducerPath]: hubApi.reducer,
  [serviceStatusApi.reducerPath]: serviceStatusApi.reducer,
  [authSlice.name]: authSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      // Note on redux-persist:
      // If we eventually start to use serialization for redux, we need to ignore some actions
      // from redux-persist `ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]`,
      // reference: https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
      serializableCheck: false, // we are currently storing some non-serializable objects in the store including wallet connect objects. it would be nice to fix this.
      immutableCheck: false, // without disabling this, we get a max call stack exceeded when switching from mainnet to xdai. It is likely due to storing an object in redux that has a circular reference to itself.
    });
    middlewares.push(
      ...[safesApi.middleware, serviceStatusApi.middleware, hubApi.middleware]
    );

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

export const persistor = persistStore(store);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppGetState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;

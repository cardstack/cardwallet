import { getKeychainIntegrityState } from './localstorage/globalSettings';

import store from '@rainbow-me/redux/store';
import { checkKeychainIntegrity } from '@rainbow-me/redux/wallets';

export const runKeychainIntegrityChecks = () => {
  setTimeout(async () => {
    const keychainIntegrityState = await getKeychainIntegrityState();
    if (!keychainIntegrityState) {
      await store.dispatch(checkKeychainIntegrity());
    }
  }, 5000);
};

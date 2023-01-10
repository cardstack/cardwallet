import store from '@rainbow-me/redux/store';
import { checkKeychainIntegrity } from '@rainbow-me/redux/wallets';

import { getKeychainIntegrityState } from './localstorage/globalSettings';

export const runKeychainIntegrityChecks = () => {
  setTimeout(async () => {
    const keychainIntegrityState = await getKeychainIntegrityState();
    if (!keychainIntegrityState) {
      await store.dispatch(checkKeychainIntegrity());
    }
  }, 5000);
};

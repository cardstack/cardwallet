import AsyncStorage from '@react-native-async-storage/async-storage';
import { concat, flatten, keys, map } from 'lodash';

import { NetworkType } from '@cardstack/types';

import logger from 'logger';

import { accountLocalKeys } from './accountLocal';
import { getKey } from './common';
import { walletConnectAccountLocalKeys } from './walletconnectRequests';

export const removeWalletData = async (accountAddress: string) => {
  logger.log('[remove wallet]', accountAddress);
  const allPrefixes = concat(accountLocalKeys, walletConnectAccountLocalKeys);
  logger.log('[remove wallet] - all prefixes', allPrefixes);
  const networks = keys(NetworkType);
  const allKeysWithNetworks = map(allPrefixes, prefix =>
    map(networks, network => getKey(prefix, accountAddress, network))
  );
  const allKeys = flatten(allKeysWithNetworks);
  try {
    await AsyncStorage.multiRemove(allKeys);
  } catch (error) {
    logger.log('Error removing wallet data from storage', error);
  }
};

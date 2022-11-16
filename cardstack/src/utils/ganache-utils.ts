import { GANACHE_URL } from 'react-native-dotenv';

import { NetworkType } from '@cardstack/types';

import { etherWeb3SetHttpProvider } from '@rainbow-me/handlers/web3';

export const GanacheUtils = {
  connect: async (callback?: () => void): Promise<void> => {
    try {
      const network = GANACHE_URL || 'http://127.0.0.1:7545';

      await etherWeb3SetHttpProvider(network);
    } catch (e) {
      await etherWeb3SetHttpProvider(NetworkType.mainnet);
    }

    if (callback) {
      callback();
    }
  },
};

export default GanacheUtils;

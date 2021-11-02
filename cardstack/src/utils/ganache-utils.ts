import { GANACHE_URL } from 'react-native-dotenv';
import { etherWeb3SetHttpProvider } from '@rainbow-me/handlers/web3';
// eslint-disable-next-line import/no-named-as-default
import networkTypes from '@rainbow-me/networkTypes';

export const GanacheUtils = {
  connect: async (callback?: () => void): Promise<void> => {
    try {
      const network = GANACHE_URL || 'http://127.0.0.1:7545';

      await etherWeb3SetHttpProvider(network);
    } catch (e) {
      await etherWeb3SetHttpProvider(networkTypes.mainnet);
    }

    if (callback) {
      callback();
    }
  },
};

export default GanacheUtils;

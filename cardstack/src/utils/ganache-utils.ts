import { GANACHE_URL } from 'react-native-dotenv';
import { web3SetHttpProvider } from '@rainbow-me/handlers/web3';
import networkTypes from '@rainbow-me/networkTypes';

export const GanacheUtils = {
  connect: async (callback?: () => void): Promise<void> => {
    try {
      const network = GANACHE_URL || 'http://127.0.0.1:7545';

      await web3SetHttpProvider(network);
    } catch (e) {
      await web3SetHttpProvider(networkTypes.mainnet);
    }

    if (callback) {
      callback();
    }
  },
};

export default GanacheUtils;

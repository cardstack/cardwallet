import { GANACHE_URL_ANDROID, GANACHE_URL_IOS } from 'react-native-dotenv';
import { web3SetHttpProvider } from '@rainbow-me/handlers/web3';
import logger from 'logger';
import networkTypes from '@rainbow-me/networkTypes';

const TAG = 'GanacheUtils';

export const GanacheUtils = {
  connect: async (callback?: () => void): Promise<void> => {
    try {
      const network =
        GANACHE_URL_IOS || GANACHE_URL_ANDROID || 'http://127.0.0.1:7545';

      const ready = await web3SetHttpProvider(network);

      logger.log(TAG, 'connected to ganache', ready);
    } catch (e) {
      await web3SetHttpProvider(networkTypes.mainnet);
      logger.log(TAG, 'error connecting to ganache');
    }

    if (callback) {
      callback();
    }
  },
};

export default GanacheUtils;

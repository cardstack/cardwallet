import { getSDK } from '@cardstack/cardpay-sdk';
import { captureException } from '@sentry/react-native';

import logger from 'logger';

import {
  EthersSignerParams,
  getWeb3ProviderWithEthSigner,
} from './ethers-wallet';

export const getSafesInstance = async (signerParams?: EthersSignerParams) => {
  try {
    const [web3, signer] = await getWeb3ProviderWithEthSigner(signerParams);

    const safes = await getSDK('Safes', web3, signer);

    return safes;
  } catch (e) {
    logger.sentry('Unable to get safeInstance', e);
    captureException(e);
  }
};

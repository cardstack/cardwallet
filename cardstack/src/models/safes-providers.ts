import { getSDK } from '@cardstack/cardpay-sdk';
import { captureException } from '@sentry/minimal';

import logger from 'logger';

import { SignedProviderParams } from './hd-provider';
import Web3Instance from './web3-instance';

export const getSafesInstance = async (
  signedProviderParams?: SignedProviderParams
) => {
  try {
    const web3 = await Web3Instance.get(signedProviderParams);
    const safes = await getSDK('Safes', web3);

    return safes;
  } catch (e) {
    logger.sentry('Unable to get safeInstance', e);
    captureException(e);
  }
};

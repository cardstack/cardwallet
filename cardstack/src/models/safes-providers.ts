import { getSDK } from '@cardstack/cardpay-sdk';
import { captureException } from '@sentry/minimal';
import { SignedProviderParams } from './hd-provider';
import Web3Instance from './web3-instance';
import logger from 'logger';

export const getSafesInstance = async (
  signedProviderParams?: SignedProviderParams
) => {
  try {
    const web3 = await Web3Instance.get(signedProviderParams);
    const safes = await getSDK('Safes', web3);

    return safes;
  } catch (e) {
    captureException(e);
    logger.sentry('Unable to get safeInstance', e);
  }
};

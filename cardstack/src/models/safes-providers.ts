import { getSDK } from '@cardstack/cardpay-sdk';
import { captureException } from '@sentry/minimal';
import { SignedProviderParams } from './hd-provider';
import Web3Instance from './web3-instance';
import logger from 'logger';
import { MainRoutes } from '@cardstack/navigation';
import { Navigation } from '@rainbow-me/navigation';

export const getSafesInstance = async (
  signedProviderParams?: SignedProviderParams
) => {
  try {
    const web3 = await Web3Instance.get(signedProviderParams);
    const safes = await getSDK('Safes', web3);

    return safes;
  } catch (e) {
    Navigation.handleAction(MainRoutes.ERROR_FALLBACK_SCREEN, {}, true);
    captureException(e);
    logger.sentry('Unable to get safeInstance', e);
  }
};

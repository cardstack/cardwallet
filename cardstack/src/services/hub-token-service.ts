import { getConstantByNetwork, getSDK } from '@cardstack/cardpay-sdk';

import { getWeb3ProviderWithEthSigner } from '@cardstack/models/ethers-wallet';
import { NetworkType } from '@cardstack/types';

import {
  getLocal,
  saveLocal,
  removeLocal,
} from '@rainbow-me/handlers/localstorage/common';
import { loadAddress } from '@rainbow-me/model/wallet';
import logger from 'logger';

const HUBTOKEN_KEY = 'hubToken';

export const getHubUrl = (network: NetworkType): string =>
  getConstantByNetwork('hubUrl', network);

const hubTokenStorageKey = (network: string): string => {
  return `${HUBTOKEN_KEY}-${network}`;
};

export const loadHubAuthToken = async (
  walletAddress: string,
  network: NetworkType
): Promise<string | null> => {
  const {
    data: { authToken },
  } = ((await getLocal(
    hubTokenStorageKey(network),
    undefined,
    walletAddress
  )) || {
    data: { authToken: null },
  }) as any;

  return authToken;
};

const storeHubAuthToken = async (
  tokenStorageKey: string,
  authToken: string,
  walletAddress: string
) => {
  // expires in a day.
  await saveLocal(
    tokenStorageKey,
    { data: { authToken } },
    1000 * 3600 * 24,
    undefined,
    walletAddress
  );
};

export const removeHubAuthToken = (address: string, network: NetworkType) =>
  removeLocal(hubTokenStorageKey(network), address);

export const getHubAuthToken = async (
  network: NetworkType,
  walletAddress?: string
): Promise<string | null> => {
  // load wallet address when not provided as an argument(this keychain access does not require passcode/biometric auth)
  const address = walletAddress || (await loadAddress()) || '';

  // Validate if authToken isn't already saved and use it.
  const savedAuthToken = await loadHubAuthToken(address, network);

  if (savedAuthToken) {
    return savedAuthToken;
  }

  try {
    const [web3, signer] = await getWeb3ProviderWithEthSigner({
      accountAddress: address,
    });

    const authAPI = await getSDK('HubAuth', web3, undefined, signer);

    const authToken = await authAPI.authenticate({ from: address });

    await storeHubAuthToken(hubTokenStorageKey(network), authToken, address);

    return authToken;
  } catch (e) {
    logger.sentry('Hub authenticate failed', e);

    return null;
  }
};

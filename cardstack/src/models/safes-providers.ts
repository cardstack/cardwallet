import { getSDK } from '@cardstack/cardpay-sdk';
import HDWalletProvider from 'parity-hdwallet-provider';
import Web3 from 'web3';
import { getSeedPhrase, RainbowWallet } from '@rainbow-me/model/wallet';
import logger from 'logger';
import { ethereumUtils } from '@rainbow-me/utils';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';
import { Network } from '@rainbow-me/helpers/networkTypes';

interface SignedProviderParams {
  selectedWallet: RainbowWallet;
  network: Network;
}

export const getHdSignedProvider = async ({
  selectedWallet,
  network,
}: SignedProviderParams) => {
  try {
    const seedPhrase = await getSeedPhrase(selectedWallet.id);
    const chainId = ethereumUtils.getChainIdFromNetwork(network);

    const hdProvider = new HDWalletProvider({
      chainId,
      mnemonic: {
        phrase: seedPhrase?.seedphrase || '',
      },
      providerOrUrl: web3ProviderSdk,
    });

    return hdProvider;
  } catch (e) {
    logger.error('Unable to getSeedPhrase', e);
  }
};

export const getSafesInstance = async (
  signedProviderParams?: SignedProviderParams
) => {
  let web3Provider = web3ProviderSdk;

  if (signedProviderParams) {
    web3Provider = await getHdSignedProvider(signedProviderParams);
  }

  const web3 = new Web3(web3Provider);

  try {
    const safes = await getSDK('Safes', web3);

    return safes;
  } catch (e) {
    logger.error('Unable to get safeInstance', e);
  }
};

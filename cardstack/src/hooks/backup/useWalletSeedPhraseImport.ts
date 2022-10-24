import { useCallback, useRef } from 'react';

import { deriveWalletFromSeed } from '@cardstack/models/ethers-wallet';

import { isValidSeedPhrase } from '@rainbow-me/helpers/validators';
import { useWalletManager } from '@rainbow-me/hooks';
import { EthereumWalletFromSeed } from '@rainbow-me/model/wallet';
import { sanitizeSeedPhrase } from '@rainbow-me/utils';
import logger from 'logger';

export const useWalletSeedPhraseImport = (
  seedPhrase: string,
  ethWallet?: EthereumWalletFromSeed
) => {
  const { importWallet } = useWalletManager();

  const checkedWallet = useRef<EthereumWalletFromSeed | undefined>(ethWallet);

  const handleImportWallet = useCallback(async () => {
    const seed = sanitizeSeedPhrase(seedPhrase);

    if (!isValidSeedPhrase(seed)) {
      logger.error('Error importing invalid seed phrase.');

      return;
    }

    checkedWallet.current = await deriveWalletFromSeed(seedPhrase);

    try {
      await importWallet({
        seed,
        checkedWallet: checkedWallet.current,
      });
    } catch (error) {
      logger.error('Error importing seed phrase: ', error);
    }
  }, [checkedWallet, importWallet, seedPhrase]);

  return { handleImportWallet };
};

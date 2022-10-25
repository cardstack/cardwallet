import { useCallback, useRef, useMemo } from 'react';

import { deriveWalletFromSeed } from '@cardstack/models/ethers-wallet';

import { isValidSeedPhrase } from '@rainbow-me/helpers/validators';
import { useWalletManager } from '@rainbow-me/hooks';
import { EthereumWalletFromSeed } from '@rainbow-me/model/wallet';
import { sanitizeSeedPhrase } from '@rainbow-me/utils/formatters';
import logger from 'logger';

export const useWalletSeedPhraseImport = (
  seedPhrase: string,
  ethWallet?: EthereumWalletFromSeed
) => {
  const { importWallet } = useWalletManager();

  const checkedWallet = useRef<EthereumWalletFromSeed | undefined>(ethWallet);

  const sanitizedSeedPhrase = useMemo(() => sanitizeSeedPhrase(seedPhrase), [
    seedPhrase,
  ]);

  const isSeedPhraseValid = useMemo(() => isValidSeedPhrase(seedPhrase), [
    seedPhrase,
  ]);

  const handleImportWallet = useCallback(async () => {
    if (!isSeedPhraseValid || !sanitizedSeedPhrase) {
      logger.error('Error: Seed phrase provided is invalid.');

      return;
    }

    checkedWallet.current = await deriveWalletFromSeed(sanitizedSeedPhrase);

    try {
      await importWallet({
        seed: sanitizedSeedPhrase,
        checkedWallet: checkedWallet.current,
      });
    } catch (error) {
      logger.error('Error importing seed phrase: ', error);
    }
  }, [checkedWallet, importWallet, isSeedPhraseValid, sanitizedSeedPhrase]);

  return { handleImportWallet, isSeedPhraseValid };
};

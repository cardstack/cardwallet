import { useCallback, useMemo } from 'react';

import { isValidSeedPhrase } from '@rainbow-me/helpers/validators';
import { useWalletManager } from '@rainbow-me/hooks';
import ethereumUtils from '@rainbow-me/utils/ethereumUtils';
import { sanitizeSeedPhrase } from '@rainbow-me/utils/formatters';
import logger from 'logger';

export const useWalletSeedPhraseImport = (seedPhrase: string) => {
  const { importWallet } = useWalletManager();

  const isSeedPhraseValid = useMemo(() => isValidSeedPhrase(seedPhrase), [
    seedPhrase,
  ]);

  const handleImportWallet = useCallback(async () => {
    // Cleans undesired white spaces.
    const cleanSeedPhrase = sanitizeSeedPhrase(seedPhrase);

    if (!isSeedPhraseValid || !cleanSeedPhrase) {
      logger.error('Error: Seed phrase provided is invalid.');

      return;
    }

    try {
      const checkedWallet = await ethereumUtils.deriveAccountFromWalletInput(
        seedPhrase
      );

      await importWallet({
        seed: cleanSeedPhrase,
        checkedWallet,
      });
    } catch (error) {
      logger.error('Error importing seed phrase: ', error);
    }
  }, [seedPhrase, importWallet, isSeedPhraseValid]);

  return { handleImportWallet, isSeedPhraseValid };
};

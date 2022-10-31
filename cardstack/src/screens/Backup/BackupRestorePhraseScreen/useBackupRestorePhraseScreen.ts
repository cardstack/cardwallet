import { useState, useCallback } from 'react';

import { isValidSeedPhrase } from '@rainbow-me/helpers/validators';
import { useWalletManager } from '@rainbow-me/hooks';
import ethereumUtils from '@rainbow-me/utils/ethereumUtils';
import { sanitizeSeedPhrase } from '@rainbow-me/utils/formatters';
import logger from 'logger';

export const useBackupRestorePhraseScreen = () => {
  const { importWallet } = useWalletManager();

  const [phrase, setPhrase] = useState('');
  const [isPhraseComplete, setIsPhraseComplete] = useState(false);
  const [isPhraseWrong, setIsPhraseWrong] = useState(false);

  const onResetPhrasePressed = useCallback(() => {
    setPhrase('');
    setIsPhraseComplete(false);
    setIsPhraseWrong(false);
  }, []);

  const handlePhraseTextChange = useCallback(
    (updatedPhrase: string) => {
      setPhrase(updatedPhrase);
      const words = updatedPhrase.match(/\w+/g) ?? [];

      // Phrase is deamed complete when it has 12 words
      setIsPhraseComplete(words.length === 12);

      // Reset wrong state when on edit
      if (isPhraseWrong) setIsPhraseWrong(false);
    },
    [isPhraseWrong]
  );

  const onDonePressed = useCallback(async () => {
    const isSeedPhraseValid = isValidSeedPhrase(phrase);

    setIsPhraseWrong(!isSeedPhraseValid);

    if (!isSeedPhraseValid) {
      logger.error('Error: Seed phrase provided is invalid.');

      return;
    }

    try {
      const sanitizedPhrase = sanitizeSeedPhrase(phrase);

      const checkedWallet = await ethereumUtils.deriveAccountFromWalletInput(
        sanitizedPhrase
      );

      await importWallet({
        seed: sanitizedPhrase,
        checkedWallet,
      });
    } catch (error) {
      logger.error('Error deriving and importing wallet.', error);
    }
  }, [phrase, importWallet]);

  return {
    phrase,
    isPhraseComplete,
    isPhraseWrong,
    handlePhraseTextChange,
    onResetPhrasePressed,
    onDonePressed,
  };
};

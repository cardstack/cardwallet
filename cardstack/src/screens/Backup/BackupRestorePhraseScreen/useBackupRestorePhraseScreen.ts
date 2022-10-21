import { useState, useCallback } from 'react';

import { useWalletSeedPhraseImport } from '@cardstack/hooks';

import { isValidSeedPhrase } from '@rainbow-me/helpers/validators';

export const useBackupRestorePhraseScreen = () => {
  const [phrase, setPhrase] = useState('');
  const [isPhraseComplete, setIsPhraseComplete] = useState(false);
  const [isPhraseWrong, setIsPhraseWrong] = useState(false);

  const {
    showWalletProfileModal,
    deriveWalletAndEns,
  } = useWalletSeedPhraseImport(phrase);

  const onResetPhrasePressed = useCallback(() => {
    setPhrase('');
    setIsPhraseComplete(false);
    setIsPhraseWrong(false);
  }, []);

  const handlePhraseTextChange = useCallback((updatedPhrase: string) => {
    setPhrase(updatedPhrase);

    const words = updatedPhrase.split(' ');

    // Phrase is deamed complete when it has 12 words
    const isComplete =
      words.length === 12 && words[words.length - 1].length > 0;

    setIsPhraseComplete(isComplete);
  }, []);

  const onDonePressed = useCallback(async () => {
    const isPhraseValid = isValidSeedPhrase(phrase);

    if (isPhraseValid) {
      // Calls import wallet modal.
      // Wallet derivation is separate so the hook can still be compatible with ImportSeedSheet.
      await deriveWalletAndEns();
      showWalletProfileModal();

      return;
    }

    setIsPhraseWrong(!isPhraseValid);
  }, [phrase, deriveWalletAndEns, showWalletProfileModal]);

  return {
    phrase,
    isPhraseComplete,
    isPhraseWrong,
    handlePhraseTextChange,
    onResetPhrasePressed,
    onDonePressed,
  };
};

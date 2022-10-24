import { useState, useCallback } from 'react';

import { useWalletSeedPhraseImport, useBooleanState } from '@cardstack/hooks';

import { isValidSeedPhrase } from '@rainbow-me/helpers/validators';

export const useBackupRestorePhraseScreen = () => {
  const [phrase, setPhrase] = useState('');
  const [isPhraseComplete, setIsPhraseComplete] = useState(false);
  const [isPhraseWrong, setIsPhraseWrong] = useState(false);
  const [loading, setLoading, setLoadingDone] = useBooleanState();

  const { handleImportWallet } = useWalletSeedPhraseImport(phrase);

  const onResetPhrasePressed = useCallback(() => {
    setPhrase('');
    setIsPhraseComplete(false);
    setIsPhraseWrong(false);
  }, []);

  const handlePhraseTextChange = useCallback(
    (updatedPhrase: string) => {
      setPhrase(updatedPhrase);

      const words = updatedPhrase.split(' ');

      // Phrase is deamed complete when it has 12 words
      const isComplete =
        words.length === 12 && words[words.length - 1].length > 0;

      setIsPhraseComplete(isComplete);

      // Reset wrong state when on edit
      if (isPhraseWrong) setIsPhraseWrong(false);
    },
    [isPhraseWrong]
  );

  const onDonePressed = useCallback(async () => {
    setLoading();

    const isPhraseValid = isValidSeedPhrase(phrase);

    if (isPhraseValid) {
      await handleImportWallet();
    }

    setIsPhraseWrong(!isPhraseValid);
    setLoadingDone();
  }, [phrase, setLoading, setLoadingDone, handleImportWallet]);

  return {
    phrase,
    isPhraseComplete,
    isPhraseWrong,
    handlePhraseTextChange,
    onResetPhrasePressed,
    onDonePressed,
    loading,
  };
};

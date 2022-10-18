import { useCallback } from 'react';

export const useBackupRestorePhraseScreen = () => {
  const handlePhraseTextChange = useCallback(() => {
    // TBD
  }, []);

  return {
    handlePhraseTextChange,
    isPhraseComplete: false,
    isPhraseWrong: false,
  };
};

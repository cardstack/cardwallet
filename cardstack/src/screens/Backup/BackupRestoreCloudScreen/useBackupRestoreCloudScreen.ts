import { useCallback } from 'react';

import { usePasswordInput } from '@cardstack/components';

export const useBackupRestoreCloudScreen = () => {
  const { password, onChangeText } = usePasswordInput({});

  const handleRestoreOnPress = useCallback(() => {
    // TBD
  }, []);

  return {
    isSubmitDisabled: !password,
    password,
    onChangeText,
    handleRestoreOnPress,
  };
};

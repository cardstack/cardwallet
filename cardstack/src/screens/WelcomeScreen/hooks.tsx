import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';

import { Routes } from '@cardstack/navigation/routes';

import { useWalletManager } from '@rainbow-me/hooks';

export const useWelcomeScreen = () => {
  const { navigate } = useNavigation<StackNavigationProp<ParamListBase>>();

  const { createNewWallet } = useWalletManager();

  const onCreateWallet = useCallback(() => {
    createNewWallet();
  }, [createNewWallet]);

  const onAddExistingWallet = useCallback(() => {
    navigate(Routes.BACKUP_RESTORE_EXPLANATION);
  }, [navigate]);

  return { onCreateWallet, onAddExistingWallet };
};

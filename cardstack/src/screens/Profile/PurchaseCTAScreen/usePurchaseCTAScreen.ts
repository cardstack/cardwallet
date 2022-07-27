import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Routes } from '@cardstack/navigation';

export const usePurchaseCTAScreen = () => {
  const { navigate } = useNavigation();

  // TODO: change this
  const onPressSkip = useCallback(() => {
    console.log('Go wherever skips needs to go');
  }, []);

  const onPressChargeExplanation = useCallback(() => {
    navigate(Routes.PROFILE_CHARGE_EXPLANATION);
  }, [navigate]);

  // TODO: change this when IAP is working
  const onPressBuy = useCallback(() => {
    console.log('Start IAP process');
  }, []);

  return { onPressChargeExplanation, onPressBuy, onPressSkip };
};

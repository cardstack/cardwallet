import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

const usePurchaseCTAScreen = () => {
  const { goBack } = useNavigation();

  // TODO: change this
  const onPressSkip = useCallback(() => {
    console.log('Go wherever skips needs to go');
  }, []);

  // TODO: change this when doing CS-4080
  const onPressChargeExplanation = useCallback(() => {
    console.log('Go to charge explanation screen');
  }, []);

  // TODO: change this when IAP is working
  const onPressBuy = useCallback(() => {
    console.log('Start IAP process');
  }, []);

  return { goBack, onPressChargeExplanation, onPressBuy, onPressSkip };
};

export default usePurchaseCTAScreen;

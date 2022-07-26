import { useCallback } from 'react';

export const usePurchaseCTAScreen = () => {
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

  return { onPressChargeExplanation, onPressBuy, onPressSkip };
};

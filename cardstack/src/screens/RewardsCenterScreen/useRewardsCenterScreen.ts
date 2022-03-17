import { useCallback } from 'react';
import { useGetRewardsSafeQuery } from '@cardstack/services/rewards-center/rewards-center-api';
import { useAccountSettings } from '@rainbow-me/hooks';

export const useRewardsCenterScreen = () => {
  const { accountAddress, nativeCurrency } = useAccountSettings();

  const { data: { rewardSafes } = {} } = useGetRewardsSafeQuery({
    accountAddress,
    nativeCurrency,
  });

  const onRegisterPress = useCallback(() => {
    //pass
  }, []);

  return {
    rewardSafes,
    isRegistered: !!rewardSafes?.length,
    onRegisterPress,
  };
};

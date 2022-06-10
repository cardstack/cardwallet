import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';

import { strings } from './strings';

const useRewardsPromoBanner = (hasUnclaimedRewards: boolean) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    navigate(Routes.REWARDS_CENTER_SCREEN);
  }, [navigate]);

  const bannerData = useMemo(
    () => (hasUnclaimedRewards ? strings.claim : strings.check),
    [hasUnclaimedRewards]
  );

  return {
    onPress,
    ...bannerData,
  };
};

export default useRewardsPromoBanner;

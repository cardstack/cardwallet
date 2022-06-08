import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';
import useRewardsDataFetch from '@cardstack/screens/RewardsCenterScreen/useRewardsDataFetch';

import rewardsPromoBanner from '../../assets/promo-rewards.png';
import rewardsUnclaimedBanner from '../../assets/rewards-unclaimed.png';
import { IconProps } from '../Icon';

import { strings } from './strings';

const rewardsIconProps: IconProps = {
  name: 'rewards',
  size: 22,
  color: 'black',
  pathFillColor: 'black',
};

const useRewardsPromoBanner = () => {
  const { navigate } = useNavigation();
  const { mainPoolTokenInfo } = useRewardsDataFetch();

  const onPress = useCallback(() => {
    navigate(Routes.REWARDS_CENTER_SCREEN);
  }, [navigate]);

  const bannerSource = useMemo(
    () => (mainPoolTokenInfo ? rewardsUnclaimedBanner : rewardsPromoBanner),
    [mainPoolTokenInfo]
  );

  const buttonLabel = useMemo(
    () => (mainPoolTokenInfo ? strings.getStarted : strings.rewards),
    [mainPoolTokenInfo]
  );

  const buttonIcon = useMemo(
    () => (mainPoolTokenInfo ? rewardsIconProps : undefined),
    [mainPoolTokenInfo]
  );

  return {
    onPress,
    bannerSource,
    buttonLabel,
    buttonIcon,
  };
};

export default useRewardsPromoBanner;

import React, { memo } from 'react';
import { SafeSelectionList } from '../components';
import { strings } from './strings';
import { useRewardWithdrawToScreen } from './useRewardWithdrawToScreen';
import { Container, NavigationStackHeader } from '@cardstack/components';

const RewardWithdrawToScreen = () => {
  const { onSafePress, availableSafesToWithdraw } = useRewardWithdrawToScreen();

  return (
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.headerTitle} />
      <SafeSelectionList
        safes={availableSafesToWithdraw}
        onSafePress={onSafePress}
      />
    </Container>
  );
};

export default memo(RewardWithdrawToScreen);

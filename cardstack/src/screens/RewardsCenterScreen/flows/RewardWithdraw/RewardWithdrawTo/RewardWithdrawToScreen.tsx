import React, { memo } from 'react';
import { ActivityIndicator } from 'react-native';

import {
  CenteredContainer,
  Container,
  NavigationStackHeader,
} from '@cardstack/components';

import { SafeSelectionList } from '../components';

import { strings } from './strings';
import { useRewardWithdrawToScreen } from './useRewardWithdrawToScreen';

const RewardWithdrawToScreen = () => {
  const {
    onSafePress,
    availableSafesToWithdraw,
    isLoading,
  } = useRewardWithdrawToScreen();

  return (
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.headerTitle} />
      {isLoading ? (
        <CenteredContainer flex={1}>
          <ActivityIndicator />
        </CenteredContainer>
      ) : (
        <SafeSelectionList
          safes={availableSafesToWithdraw}
          onSafePress={onSafePress}
        />
      )}
    </Container>
  );
};

export default memo(RewardWithdrawToScreen);

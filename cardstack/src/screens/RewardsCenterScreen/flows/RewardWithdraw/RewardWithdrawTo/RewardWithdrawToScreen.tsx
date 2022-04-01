import React, { memo } from 'react';
import { strings } from './strings';
import { useRewardWithdrawToScreen } from './useRewardWithdrawToScreen';
import {
  Container,
  NavigationStackHeader,
  Text,
  Touchable,
} from '@cardstack/components';

const RewardWithdrawToScreen = () => {
  const { onSafePress, availableSafesToWithdraw } = useRewardWithdrawToScreen();

  return (
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.headerTitle} />
      {availableSafesToWithdraw.map(safe => (
        <Touchable padding={2} onPress={onSafePress(safe)}>
          <Text>{`${safe.type}\n${safe.address} `}</Text>
        </Touchable>
      ))}
    </Container>
  );
};

export default memo(RewardWithdrawToScreen);

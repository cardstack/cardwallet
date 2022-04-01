import React, { memo } from 'react';
import { strings } from './strings';
import { useRewardWithdrawConfimationScreen } from './useRewardWithdrawConfimationScreen';
import {
  Button,
  Container,
  NavigationStackHeader,
  Text,
} from '@cardstack/components';

const RewardWithdrawConfirmationScreen = () => {
  const {
    params: { tokenInfo, fromRewardSafe, withdrawTo },
    onCancelPress,
    onConfirmPress,
  } = useRewardWithdrawConfimationScreen();

  return (
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.headerTitle} />
      <Container padding={4}>
        <Text>
          {tokenInfo.token.name} {tokenInfo.balance.display}
        </Text>
        <Text>FROM: {fromRewardSafe}</Text>
        <Text>TO: {withdrawTo.address}</Text>
        <Container flexDirection="row" justifyContent="space-between">
          <Button onPress={onCancelPress} variant="smallWhite">
            Cancel
          </Button>
          <Button onPress={onConfirmPress} variant="small">
            Confirm
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(RewardWithdrawConfirmationScreen);

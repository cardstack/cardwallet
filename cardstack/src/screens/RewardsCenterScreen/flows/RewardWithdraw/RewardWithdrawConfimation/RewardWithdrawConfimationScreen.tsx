import React, { memo } from 'react';
import { strings } from './strings';
import { useRewardWithdrawConfimationScreen } from './useRewardWithdrawConfimationScreen';
import { SectionCoinHeader } from '@cardstack/components/TransactionConfirmationSheet/displays/components/SectionCoinHeader';
import { RewardsNetAmountSection } from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/RewardsNetAmountSection';
import {
  Button,
  Container,
  NavigationStackHeader,
  Text,
  HorizontalDivider,
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
      <SectionCoinHeader
        title={strings.withdraw.title}
        symbol={tokenInfo.token.symbol}
        primaryText={tokenInfo.balance.display}
        secondaryText={tokenInfo.native.balance.display}
      />
      <HorizontalDivider />
      {/* Selected Safe Display */}
      <RewardsNetAmountSection headerText={strings.net.title} {...data} />

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

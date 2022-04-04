import React, { memo, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeSelectionItem } from '../components/SafeSelectionItem';
import { strings } from './strings';
import { useRewardWithdrawConfimationScreen } from './useRewardWithdrawConfimationScreen';
import { SectionCoinHeader } from '@cardstack/components/TransactionConfirmationSheet/displays/components/SectionCoinHeader';
import { SectionHeaderText } from '@cardstack/components/TransactionConfirmationSheet/displays/components/SectionHeaderText';
import { AmountSection } from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/AmountSection';
import {
  Button,
  Container,
  NavigationStackHeader,
  HorizontalDivider,
} from '@cardstack/components';

// TEMP: should return from hook.
const isLoadingGasFee = false;

const RewardWithdrawConfirmationScreen = () => {
  const {
    params: { tokenInfo, withdrawTo },
    onCancelPress,
    onConfirmPress,
  } = useRewardWithdrawConfimationScreen();

  const data = useMemo(
    () => [
      {
        description: strings.net.amount,
        valueDisplay: tokenInfo.balance.display,
      },
      {
        description: strings.net.estGas,
        valueDisplay: '- Z CARD.CPXD',
      },
      {
        description: strings.net.estNet,
        valueDisplay: 'XY CARD.CPXD',
      },
    ],
    [tokenInfo]
  );

  return (
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.headerTitle} />
      <Container padding={4} flex={1} justifyContent="space-between">
        <Container flex={1}>
          <SectionCoinHeader
            title={strings.withdraw.title}
            symbol={tokenInfo.token.symbol}
            primaryText={tokenInfo.balance.display}
            secondaryText={tokenInfo.native.balance.display}
          />
          <HorizontalDivider />

          <SectionHeaderText>{strings.withdrawTo.title}</SectionHeaderText>
          <SafeSelectionItem safe={withdrawTo} />
          <HorizontalDivider />

          {isLoadingGasFee ? (
            <Container flex={0.5} justifyContent="center">
              <ActivityIndicator />
            </Container>
          ) : (
            <AmountSection title={strings.net.title} data={data} />
          )}
        </Container>

        <Container flexDirection="row" justifyContent="space-between">
          <Button onPress={onCancelPress} variant="smallWhite">
            Cancel
          </Button>
          <Button
            loading={isLoadingGasFee}
            onPress={onConfirmPress}
            variant="small"
          >
            Confirm
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(RewardWithdrawConfirmationScreen);

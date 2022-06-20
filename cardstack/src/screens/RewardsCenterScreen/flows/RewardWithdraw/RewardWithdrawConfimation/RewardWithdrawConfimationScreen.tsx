import React, { memo, useMemo } from 'react';

import {
  Button,
  Container,
  NavigationStackHeader,
  HorizontalDivider,
} from '@cardstack/components';
import { SectionCoinHeader } from '@cardstack/components/TransactionConfirmationSheet/displays/components/SectionCoinHeader';
import { SectionHeaderText } from '@cardstack/components/TransactionConfirmationSheet/displays/components/SectionHeaderText';
import { AmountSection } from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/AmountSection';

import { SafeSelectionItem } from '../components/SafeSelectionItem';

import { strings } from './strings';
import { useRewardWithdrawConfimationScreen } from './useRewardWithdrawConfimationScreen';

const RewardWithdrawConfirmationScreen = () => {
  const {
    params: { tokenInfo, withdrawTo },
    onCancelPress,
    onConfirmPress,
    isLoadingGasEstimate,
    gasEstimateInEth,
    estimatedNetClaim,
  } = useRewardWithdrawConfimationScreen();

  const amountData = useMemo(
    () => [
      {
        description: strings.net.amount,
        valueDisplay: tokenInfo.balance.display,
      },
      {
        description: strings.net.estGas,
        valueDisplay: `-${gasEstimateInEth} ${tokenInfo.token.symbol}`,
      },
      {
        description: strings.net.estNet,
        valueDisplay: `${estimatedNetClaim} ${tokenInfo.token.symbol}`,
      },
    ],
    [tokenInfo, gasEstimateInEth, estimatedNetClaim]
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
          <SectionHeaderText paddingBottom={4}>
            {strings.withdrawTo.title}
          </SectionHeaderText>
          <SafeSelectionItem safe={withdrawTo} />
          <HorizontalDivider />
          <AmountSection
            title={strings.net.title}
            data={amountData}
            showLoading={isLoadingGasEstimate}
          />
        </Container>
        <Container
          flexDirection="row"
          justifyContent="space-between"
          paddingBottom={6}
        >
          <Button onPress={onCancelPress} variant="smallWhite">
            {strings.buttons.cancel}
          </Button>
          <Button
            onPress={onConfirmPress}
            variant="small"
            disabled={isLoadingGasEstimate}
          >
            {strings.buttons.submit}
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(RewardWithdrawConfirmationScreen);

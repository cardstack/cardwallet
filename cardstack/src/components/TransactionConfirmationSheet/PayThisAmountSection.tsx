import React from 'react';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { Container, Text } from '@cardstack/components';

export const PayThisAmountSection = ({
  spendAmount,
}: {
  spendAmount: string | number;
}) => {
  const [nativeCurrency, currencyConversionRates] =
    useNativeCurrencyAndConversionRates();

  const spendDisplay = convertSpendForBalanceDisplay(
    String(spendAmount),
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container>
      <TransactionConfirmationSectionHeaderText>
        PAY THIS AMOUNT
      </TransactionConfirmationSectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        <Text size="large" weight="extraBold">
          {spendDisplay.tokenBalanceDisplay}
        </Text>
        <Text variant="subText">{spendDisplay.nativeBalanceDisplay}</Text>
      </Container>
    </Container>
  );
};

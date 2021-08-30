import React from 'react';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import { Container, NetworkBadge, Icon, Text } from '@cardstack/components';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';

export const PrepaidCardTransactionSection = ({
  headerText = 'FROM',
  prepaidCardAddress,
}: {
  headerText?: string;
  prepaidCardAddress: string;
}) => {
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const prepaidCards = useRainbowSelector(state => state.data.prepaidCards);

  const prepaidCard = prepaidCards.find(
    card => card.address === prepaidCardAddress
  );

  const spendDisplay = convertSpendForBalanceDisplay(
    String(prepaidCard?.spendFaceValue || 0),
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container marginTop={8} width="100%">
      <TransactionConfirmationSectionHeaderText>
        {headerText}
      </TransactionConfirmationSectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="prepaid-card" />
          <Container marginLeft={2}>
            <Text weight="extraBold">Prepaid Card</Text>
            <NetworkBadge marginTop={2} />
            <Container maxWidth={180} marginTop={1}>
              <Text variant="subAddress">{prepaidCardAddress}</Text>
            </Container>
            {prepaidCard && (
              <Container marginTop={3}>
                <Text fontSize={12}>Spendable Balance</Text>
                <Text fontSize={15} weight="extraBold">
                  {spendDisplay.tokenBalanceDisplay}
                </Text>
                <Text variant="subText">
                  {spendDisplay.nativeBalanceDisplay}
                </Text>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

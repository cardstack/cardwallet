import React from 'react';
import MiniPrepaidCard from '../../../../PrepaidCard/MiniPrepaidCard';
import TransactionListItem from '../TransactionListItem';
import { Container, Text } from '@cardstack/components';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';

export const PrepaidCardTransactionSection = ({
  headerText,
  prepaidCardAddress,
}: {
  headerText: string;
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
    <TransactionListItem
      headerText={headerText}
      title="Prepaid Card"
      icon={
        prepaidCard?.cardCustomization && (
          <MiniPrepaidCard cardCustomization={prepaidCard?.cardCustomization} />
        )
      }
      showNetworkBadge
      address={prepaidCardAddress}
      footer={
        prepaidCard && (
          <Container marginTop={3}>
            <Text fontSize={12}>Spendable Balance</Text>
            <Text fontSize={15} weight="extraBold">
              {spendDisplay.tokenBalanceDisplay}
            </Text>
            <Text variant="subText">{spendDisplay.nativeBalanceDisplay}</Text>
          </Container>
        )
      }
    />
  );
};

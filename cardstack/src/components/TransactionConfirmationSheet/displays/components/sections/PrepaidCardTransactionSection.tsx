import React from 'react';
import { PrepaidCardSafe } from '@cardstack/cardpay-sdk';
import MiniPrepaidCard from '../../../../PrepaidCard/MiniPrepaidCard';
import TransactionListItem from '../TransactionListItem';
import { Container, Text } from '@cardstack/components';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { useGetSafesDataQuery } from '@cardstack/services';
import { useAccountSettings } from '@rainbow-me/hooks';

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

  const { accountAddress } = useAccountSettings();

  const { prepaidCard } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      selectFromResult: ({ data }) => ({
        prepaidCard: data?.prepaidCards.find(
          (card: PrepaidCardSafe) => card.address === prepaidCardAddress
        ),
      }),
    }
  );

  const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
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
              {nativeBalanceDisplay}
            </Text>
          </Container>
        )
      }
    />
  );
};

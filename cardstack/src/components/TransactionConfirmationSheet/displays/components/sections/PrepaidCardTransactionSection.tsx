import React from 'react';

import { Container, Text } from '@cardstack/components';
import { usePrepaidCard } from '@cardstack/hooks';

import MiniPrepaidCard from '../../../../PrepaidCard/MiniPrepaidCard';
import TransactionListItem from '../TransactionListItem';

export const PrepaidCardTransactionSection = ({
  headerText,
  prepaidCardAddress,
}: {
  headerText: string;
  prepaidCardAddress: string;
}) => {
  const { prepaidCard, nativeBalanceDisplay } = usePrepaidCard(
    prepaidCardAddress
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

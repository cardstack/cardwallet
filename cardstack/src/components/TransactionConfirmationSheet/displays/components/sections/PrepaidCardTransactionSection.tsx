import React from 'react';

import { Container, Text } from '@cardstack/components';
import { usePrepaidCard } from '@cardstack/hooks';

import MiniPrepaidCard from '../../../../PrepaidCard/MiniPrepaidCard';
import TransactionListItem from '../TransactionListItem';

import PrepaidCardSectionSkeleton from './PrepaidCardSectionSkeleton';

export const PrepaidCardTransactionSection = ({
  headerText,
  prepaidCardAddress,
}: {
  headerText: string;
  prepaidCardAddress: string;
}) => {
  const { prepaidCard, nativeBalanceDisplay, isLoading } = usePrepaidCard(
    prepaidCardAddress
  );

  if (isLoading) {
    return <PrepaidCardSectionSkeleton headerText={headerText} />;
  }

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

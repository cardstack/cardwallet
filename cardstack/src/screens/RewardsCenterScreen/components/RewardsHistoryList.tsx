import { OptionalUnion } from 'globals';
import React, { useCallback } from 'react';
import { SectionList } from 'react-native';

import { Container, Text, ListEmptyComponent } from '@cardstack/components';
import { RewardeeClaim, TokenTransfer } from '@cardstack/graphql';
import { fromWeiToFixedEth } from '@cardstack/utils';

import { strings } from '../strings';
import useRewardsBalanceHistory from '../useRewardsBalanceHistory';

import { RewardRow } from '.';

export type ClaimOrTokenWithdraw = OptionalUnion<RewardeeClaim, TokenTransfer>;

export const RewardsHistoryList = () => {
  const { historySectionData } = useRewardsBalanceHistory();

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <Container backgroundColor="white">
        <Text size="medium">{section.title}</Text>
      </Container>
    ),
    []
  );

  const renderItem = useCallback(({ item }: { item: ClaimOrTokenWithdraw }) => {
    const amountInEth = fromWeiToFixedEth(item.amount);
    const symbol = item.token.symbol || '';

    const txStatus =
      item.__typename === 'RewardeeClaim' ? 'claimed' : 'withdrawn';

    return (
      <RewardRow
        primaryText={`${amountInEth} ${symbol}`}
        coinSymbol={symbol}
        txStatus={txStatus}
      />
    );
  }, []);

  const spacing = useCallback(() => <Container paddingBottom={4} />, []);

  return (
    <SectionList
      renderSectionHeader={renderSectionHeader}
      sections={historySectionData}
      renderItem={renderItem}
      ItemSeparatorComponent={spacing}
      SectionSeparatorComponent={spacing}
      ListEmptyComponent={<ListEmptyComponent text={strings.history.empty} />}
    />
  );
};

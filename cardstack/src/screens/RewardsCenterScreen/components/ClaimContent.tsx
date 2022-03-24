import React, { useCallback, useMemo } from 'react';
import { strings } from '../strings';
import {
  RewardsTitle,
  RewardRow,
  RewardRowProps,
  RewardsBalanceList,
  RewardsBalanceListProps,
  RewardsHistoryList,
  RewardsHistoryListProps,
} from '.';
import { ScrollView, Container, useTabHeader } from '@cardstack/components';

interface ClaimContentProps {
  claimList?: Array<RewardRowProps>;
  balanceList?: RewardsBalanceListProps;
  historyList?: RewardsHistoryListProps;
}

enum Tabs {
  BALANCE = 'BALANCE',
  HISTORY = 'HISTORY',
}

const tabs = [
  { title: strings.balance.title, key: Tabs.BALANCE },
  { title: strings.history.title, key: Tabs.HISTORY },
];

export const ClaimContent = ({
  claimList,
  balanceList,
  historyList,
}: ClaimContentProps) => {
  const { TabHeader, currentTab } = useTabHeader({ tabs });

  const renderClaimList = useCallback(
    () =>
      claimList?.map((item, index) => (
        <RewardRow
          coinSymbol={item.coinSymbol}
          primaryText={item.primaryText}
          subText={item.subText}
          paddingBottom={index + 1 < claimList.length ? 5 : 0}
          onClaimPress={item.onClaimPress}
        />
      )),
    [claimList]
  );

  const title = useMemo(
    () =>
      claimList ? strings.register.title : strings.register.noRewards.title,
    [claimList]
  );

  return (
    <ScrollView>
      <Container padding={5}>
        <RewardsTitle title={title} width="100%" paddingBottom={5} />
        {renderClaimList()}
      </Container>
      <TabHeader />
      <Container padding={5}>
        {currentTab.key === Tabs.BALANCE ? (
          <RewardsBalanceList {...balanceList} />
        ) : (
          <RewardsHistoryList {...historyList} />
        )}
      </Container>
    </ScrollView>
  );
};

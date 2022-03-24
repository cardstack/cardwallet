import React, { useCallback } from 'react';
import { strings } from '../strings';
import { claimList, balanceList, historyList } from './__mock__';
import {
  RewardsTitle,
  RewardRow,
  RewardsBalanceList,
  RewardsHistoryList,
} from '.';
import { ScrollView, Container, useTabHeader } from '@cardstack/components';

enum Tabs {
  BALANCE = 'BALANCE',
  HISTORY = 'HISTORY',
}

const tabs = [
  { title: strings.balance.title, key: Tabs.BALANCE },
  { title: strings.history.title, key: Tabs.HISTORY },
];

export const ClaimContent = () => {
  const { TabHeader, currentTab } = useTabHeader({ tabs });

  const renderClaimList = useCallback(
    () =>
      claimList.map((item, index) => (
        <RewardRow
          coinSymbol={item.coinSymbol}
          primaryText={item.primaryText}
          subText={item.subText}
          paddingBottom={index + 1 < claimList.length ? 5 : 0}
          onClaimPress={() => {
            //pass
          }}
        />
      )),
    []
  );

  return (
    <ScrollView>
      <Container padding={5}>
        <RewardsTitle
          title={strings.register.title}
          width="100%"
          paddingBottom={5}
        />
        {renderClaimList()}
      </Container>
      <TabHeader />
      <Container padding={5}>
        {currentTab.key === Tabs.BALANCE ? (
          <RewardsBalanceList data={balanceList} />
        ) : (
          <RewardsHistoryList sections={historyList} />
        )}
      </Container>
    </ScrollView>
  );
};

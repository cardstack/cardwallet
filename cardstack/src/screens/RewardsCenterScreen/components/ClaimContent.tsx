import React, { useCallback } from 'react';
import { strings } from '../strings';
import { RewardsTitle, RewardRow } from '.';
import { ScrollView, Container, useTabHeader } from '@cardstack/components';

const claimList = [
  {
    coinSymbol: 'CARD',
    primaryText: '3,200 CARD.CPXD',
    subText: '$45.00 USD',
  },
  {
    coinSymbol: 'CARD',
    primaryText: '1,600 CARD.CPXD',
    subText: '$22.50 USD',
  },
];

const balanceList = [
  {
    coinSymbol: 'CARD',
    primaryText: '1,600 CARD.CPXD',
  },
  {
    coinSymbol: 'CARD',
    primaryText: '800 CARD.CPXD',
  },
  {
    coinSymbol: 'CARD',
    primaryText: '400 CARD.CPXD',
  },
  {
    coinSymbol: 'CARD',
    primaryText: '200 CARD.CPXD',
  },
  {
    coinSymbol: 'CARD',
    primaryText: '100 CARD.CPXD',
  },
];

const historyList = [
  {
    coinSymbol: 'CARD',
    primaryText: '200 CARD.CPXD',
  },
  {
    coinSymbol: 'CARD',
    primaryText: '100 CARD.CPXD',
  },
  {
    coinSymbol: 'CARD',
    primaryText: '50 CARD.CPXD',
  },
];

enum Tabs {
  BALANCE,
  HISTORY,
}

export const ClaimContent = () => {
  const { TabHeader, currentTab } = useTabHeader({
    tabs: [{ title: strings.balance.title }, { title: strings.history.title }],
  });

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

  const renderBalanceList = useCallback(
    () =>
      balanceList.map(item => (
        <RewardRow
          coinSymbol={item.coinSymbol}
          primaryText={item.primaryText}
          paddingBottom={4}
        />
      )),
    []
  );

  const renderHistoryList = useCallback(
    () =>
      historyList.map(item => (
        <RewardRow
          claimed
          coinSymbol={item.coinSymbol}
          primaryText={item.primaryText}
          paddingBottom={4}
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
        {currentTab === Tabs.BALANCE
          ? renderBalanceList()
          : renderHistoryList()}
      </Container>
    </ScrollView>
  );
};

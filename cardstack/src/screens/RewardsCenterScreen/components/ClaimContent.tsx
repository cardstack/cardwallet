import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';

import { Container, useTabHeader, InfoBanner } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import {
  RewardProofType,
  FullBalanceToken,
} from '@cardstack/services/rewards-center/rewards-center-types';

import { strings } from '../strings';

import {
  RewardsTitle,
  RewardRow,
  RewardsBalanceList,
  RewardsHistoryList,
} from '.';

interface ClaimContentProps {
  mainPool?: FullBalanceToken;
  rewards?: Array<RewardProofType>;
}

enum Tabs {
  BALANCE = 'BALANCE',
  HISTORY = 'HISTORY',
}

const tabs = [
  { title: strings.balance.title, key: Tabs.BALANCE },
  { title: strings.history.title, key: Tabs.HISTORY },
];

export const ClaimContent = ({ mainPool, rewards }: ClaimContentProps) => {
  const { TabHeader, currentTab } = useTabHeader({ tabs });

  const { navigate } = useNavigation();

  const onClaimSingleRewardPress = useCallback(
    (reward?: RewardProofType) =>
      navigate(Routes.REWARD_CLAIM_SINGLE_SHEET, { reward }),
    [navigate]
  );

  const title = useMemo(
    () => (rewards ? strings.register.title : strings.register.noRewards.title),
    [rewards]
  );

  const Header = useMemo(
    () => (
      <Container padding={5}>
        <RewardsTitle title={title} width="100%" paddingBottom={5} />
        <InfoBanner
          title={strings.register.gasInfoBanner.title}
          message={strings.register.gasInfoBanner.message}
        />
        {mainPool && (
          <Container paddingTop={5}>
            <RewardRow
              coinSymbol={mainPool.token.symbol}
              primaryText={mainPool.balance.display}
              subText={mainPool.native.balance.display}
              isClaimable={!!mainPool.isClaimable}
            />
          </Container>
        )}
      </Container>
    ),
    [title, mainPool]
  );

  const Footer = useMemo(
    () => (
      <Container>
        <TabHeader />
        <Container padding={5}>
          {currentTab.key === Tabs.BALANCE ? (
            <RewardsBalanceList />
          ) : (
            <RewardsHistoryList />
          )}
        </Container>
      </Container>
    ),
    [currentTab]
  );

  const RewardItem = useCallback(
    ({ item }: { item: RewardProofType }) => (
      <Container paddingHorizontal={5} paddingBottom={2}>
        <RewardRow
          coinSymbol={item.token.symbol}
          primaryText={item.balance.display}
          subText={item.native.balance.display}
          onClaimPress={
            !!Number(item.native.balance.amount)
              ? () => onClaimSingleRewardPress(item)
              : undefined
          }
        />
      </Container>
    ),
    [onClaimSingleRewardPress]
  );

  return (
    <FlatList
      data={rewards}
      renderItem={RewardItem}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
};

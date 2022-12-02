import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';

import { Container, useTabHeader, InfoBanner } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { RewardProofType } from '@cardstack/services/rewards-center/rewards-center-types';
import { listStyle } from '@cardstack/utils';

import { strings } from '../strings';

import {
  RewardsTitle,
  RewardRow,
  RewardsBalanceList,
  RewardsHistoryList,
} from '.';

interface ClaimContentProps {
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

export const ClaimContent = ({ rewards }: ClaimContentProps) => {
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

  const ListHeader = useMemo(
    () => (
      <Container padding={5}>
        <RewardsTitle title={title} width="100%" paddingBottom={5} />
        <InfoBanner
          title={strings.register.gasInfoBanner.title}
          message={strings.register.gasInfoBanner.message}
        />
      </Container>
    ),
    [title]
  );

  const RewardItem = useCallback(
    ({ item }: { item: RewardProofType }) => (
      <Container paddingHorizontal={5} paddingBottom={2}>
        <RewardRow
          coinSymbol={item.token.symbol}
          primaryText={item.balance.display}
          subText={item.native.balance.display}
          extraInfoText={item.parsedExplanation}
          onClaimPress={
            item.isClaimable && Number(item.native.balance.amount)
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
      style={listStyle.fullWidth}
      data={rewards}
      renderItem={RewardItem}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={
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
      }
    />
  );
};

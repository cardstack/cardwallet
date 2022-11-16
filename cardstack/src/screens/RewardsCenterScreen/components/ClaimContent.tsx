import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';

import {
  ScrollView,
  Container,
  useTabHeader,
  InfoBanner,
} from '@cardstack/components';
import { Routes } from '@cardstack/navigation';

import { strings } from '../strings';

import {
  RewardsTitle,
  RewardRow,
  RewardRowProps,
  RewardsBalanceList,
  RewardsHistoryList,
} from '.';

interface ClaimContentProps {
  claimList?: Array<RewardRowProps>;
}

enum Tabs {
  BALANCE = 'BALANCE',
  HISTORY = 'HISTORY',
}

const tabs = [
  { title: strings.balance.title, key: Tabs.BALANCE },
  { title: strings.history.title, key: Tabs.HISTORY },
];

export const ClaimContent = ({ claimList }: ClaimContentProps) => {
  const { TabHeader, currentTab } = useTabHeader({ tabs });

  const { navigate } = useNavigation();

  const onClaimPress = useCallback(() => navigate(Routes.REWARDS_CLAIM_SHEET), [
    navigate,
  ]);

  const ClaimList = useMemo(
    () =>
      claimList?.map((item, index) => (
        <RewardRow
          coinSymbol={item.coinSymbol}
          primaryText={item.primaryText}
          subText={item.subText}
          paddingBottom={index + 1 < claimList.length ? 5 : 0}
          onClaimPress={item.isClaimable ? onClaimPress : undefined}
        />
      )),
    [claimList, onClaimPress]
  );

  const title = useMemo(
    () =>
      claimList ? strings.register.title : strings.register.noRewards.title,
    [claimList]
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Container padding={5}>
        <RewardsTitle title={title} width="100%" paddingBottom={5} />
        <InfoBanner
          paddingBottom={5}
          title={strings.register.gasInfoBanner.title}
          message={strings.register.gasInfoBanner.message}
        />
        {ClaimList}
      </Container>
      <TabHeader />
      <Container padding={5}>
        {currentTab.key === Tabs.BALANCE ? (
          <RewardsBalanceList />
        ) : (
          <RewardsHistoryList />
        )}
      </Container>
    </ScrollView>
  );
};

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
import {
  ScrollView,
  Container,
  useTabHeader,
  InfoBanner,
  Text,
} from '@cardstack/components';

interface ClaimContentProps {
  claimList?: Array<RewardRowProps>;
  balanceList?: RewardsBalanceListProps;
  historyList?: RewardsHistoryListProps;
  isLoadingClaimGas?: boolean;
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
  isLoadingClaimGas,
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
          isLoading={isLoadingClaimGas}
        />
      )),
    [claimList, isLoadingClaimGas]
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
        <InfoBanner
          paddingBottom={5}
          title={strings.register.gasInfoBanner.title}
          message={
            <Text size="xs">
              {strings.register.gasInfoBanner.message.part1}
              <Text size="xs" weight="bold">
                {strings.register.gasInfoBanner.message.part2}
              </Text>
              {strings.register.gasInfoBanner.message.part3}
            </Text>
          }
        />
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

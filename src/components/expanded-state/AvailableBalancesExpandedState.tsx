import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
} from 'react-native';
import { SlackSheet } from '../sheet';

import {
  BalanceSection,
  Container,
  HorizontalDivider,
  ListEmptyComponent,
  Text,
  Touchable,
  TransactionItem,
  TransactionListLoading,
} from '@cardstack/components';
import { useMerchantTransactions } from '@cardstack/hooks';
import { MerchantSafeType } from '@cardstack/types';
import { useNavigation } from '@rainbow-me/navigation';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const styles = StyleSheet.create({
  contentContainerStyle: { paddingBottom: 200 },
  sectionListStyle: { width: '100%' },
});

const CHART_HEIGHT = 650;

enum Tabs {
  ASSETS = 'Assets',
  ACTIVITIES = 'Activities',
}

interface TabHeaderProps {
  setSelectedTab: (_tab: Tabs) => void;
  selectedTab: Tabs;
  tab: Tabs;
}

interface AvailableBalancesExpandedStateProps {
  asset: MerchantSafeType;
}

export default function AvailableBalancesExpandedState(
  props: AvailableBalancesExpandedStateProps
) {
  const { setOptions } = useNavigation();
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.ASSETS);
  const merchantSafes = useRainbowSelector(state => state.data.merchantSafes);

  const merchantSafe = merchantSafes.find(
    safe => safe.address === props.asset.address
  ) as MerchantSafeType;

  const { address: safeAddress } = props.asset;

  const tokensData = merchantSafe?.tokens;

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  return (
    <SlackSheet flex={1} scrollEnabled={false}>
      <Container paddingHorizontal={5} paddingTop={3}>
        <Text size="medium">Account balances</Text>
        <Container flexDirection="row" justifyContent="space-between">
          <TabHeader
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tab={Tabs.ASSETS}
          />
          <TabHeader
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tab={Tabs.ACTIVITIES}
          />
        </Container>
      </Container>
      <HorizontalDivider marginVertical={0} />
      {selectedTab === Tabs.ASSETS ? (
        <BalanceSection navProps={{ safeAddress }} tokens={tokensData} />
      ) : (
        <Activities {...props} />
      )}
    </SlackSheet>
  );
}

const TabHeader = ({ tab, selectedTab, setSelectedTab }: TabHeaderProps) => {
  const isSelected = selectedTab === tab;
  return (
    <Touchable
      alignItems="center"
      justifyContent="center"
      onPress={() => setSelectedTab(tab)}
      paddingTop={5}
      width="50%"
    >
      <Text
        color="black"
        marginBottom={3}
        opacity={isSelected ? 1 : 0.5}
        weight={isSelected ? 'bold' : 'regular'}
      >
        {tab}
      </Text>
      <Container
        backgroundColor={isSelected ? 'buttonPrimaryBorder' : 'white'}
        height={3}
        width="100%"
      />
    </Touchable>
  );
};

const Activities = (props: AvailableBalancesExpandedStateProps) => {
  const { address } = props.asset;
  const {
    sections,
    isFetchingMore,
    onEndReached,
    refetchLoading,
    refetch,
    isLoadingTransactions,
  } = useMerchantTransactions(address, 'availableBalances');

  return (
    <Container paddingBottom={3} paddingHorizontal={5}>
      {isLoadingTransactions ? (
        <TransactionListLoading light />
      ) : (
        <SectionList
          ListEmptyComponent={<ListEmptyComponent text="No activity" />}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator color="white" /> : null
          }
          contentContainerStyle={styles.contentContainerStyle}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          refreshControl={
            <RefreshControl
              onRefresh={refetch}
              refreshing={refetchLoading}
              tintColor="white"
            />
          }
          renderItem={props => (
            <TransactionItem {...props} includeBorder isFullWidth />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Container backgroundColor="white" paddingVertical={2} width="100%">
              <Text color="blueText" size="medium">
                {title}
              </Text>
            </Container>
          )}
          sections={sections}
          style={styles.sectionListStyle}
        />
      )}
    </Container>
  );
};

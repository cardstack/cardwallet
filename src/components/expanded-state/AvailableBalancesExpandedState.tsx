import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';

import {
  BalanceSection,
  Container,
  HorizontalDivider,
  ListEmptyComponent,
  Sheet,
  Text,
  Touchable,
  TransactionItem,
  TransactionListLoading,
} from '@cardstack/components';
import { useMerchantTransactions } from '@cardstack/hooks';
import { MerchantSafeType } from '@cardstack/types';
import { sectionStyle } from '@cardstack/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const CHART_HEIGHT = 650;

enum Tabs {
  ASSETS = 'Balance',
  ACTIVITIES = 'History',
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
    <Sheet isFullScreen scrollEnabled>
      <Container paddingHorizontal={5} paddingTop={3}>
        <Text size="medium">Available Balance</Text>
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
    </Sheet>
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

  const renderItem = useCallback(
    ({ item }) => <TransactionItem includeBorder isFullWidth item={item} />,
    []
  );

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
          contentContainerStyle={sectionStyle.contentContainerStyle}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          refreshControl={
            <RefreshControl
              onRefresh={refetch}
              refreshing={refetchLoading}
              tintColor="white"
            />
          }
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Container backgroundColor="white" paddingVertical={2} width="100%">
              <Text color="blueText" size="medium">
                {title}
              </Text>
            </Container>
          )}
          sections={sections}
          style={sectionStyle.sectionList}
        />
      )}
    </Container>
  );
};

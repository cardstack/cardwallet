import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
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
import { RouteType } from '@cardstack/navigation/types';
import { MerchantSafeType } from '@cardstack/types';
import { listStyle } from '@cardstack/utils';

import { strings } from './strings';

enum Tabs {
  ASSETS = 'Balance',
  ACTIVITIES = 'History',
}

interface TabHeaderProps {
  setSelectedTab: (_tab: Tabs) => void;
  selectedTab: Tabs;
  tab: Tabs;
}

interface AvailableBalanceParams {
  merchantSafe: MerchantSafeType;
}

export default function AvailableBalanceSheets() {
  const { params } = useRoute<RouteType<AvailableBalanceParams>>();
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.ASSETS);

  const { address: safeAddress } = params.merchantSafe;

  const tokensData = params.merchantSafe?.tokens;

  return (
    <Sheet isFullScreen scrollEnabled>
      <Container paddingHorizontal={5} paddingTop={3}>
        <Text size="medium">{strings.title}</Text>
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
        <BalanceSection tokens={tokensData} safeAddress={safeAddress} />
      ) : (
        <Activities address={safeAddress} />
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

const Activities = ({ address }: Pick<MerchantSafeType, 'address'>) => {
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
          contentContainerStyle={listStyle.sheetHeightPaddingBottom}
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
          style={listStyle.fullWidth}
        />
      )}
    </Container>
  );
};

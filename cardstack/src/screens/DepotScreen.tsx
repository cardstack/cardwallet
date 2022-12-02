import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  SectionList,
} from 'react-native';

import {
  AbsoluteFullScreenContainer,
  BalanceSection,
  CenteredContainer,
  Container,
  Icon,
  ListEmptyComponent,
  SafeAreaView,
  Text,
  Touchable,
  TransactionItem,
  TransactionListLoading,
  useTabHeader,
} from '@cardstack/components';
import { useDepotTransactions } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { colors } from '@cardstack/theme';
import { DepotType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { listStyle } from '@cardstack/utils/layouts';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

interface Params {
  depot: DepotType;
}

enum Tabs {
  BALANCES = 0,
  ACTIVITIES = 1,
}

const tabs = [
  { title: 'Balances', key: Tabs.BALANCES },
  { title: 'Activities', key: Tabs.ACTIVITIES },
];

export default function DepotScreen() {
  const { goBack, navigate } = useNavigation();
  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);

  const { TabHeader, currentTab } = useTabHeader({ tabs, variant: 'dark' });

  const {
    params: { depot },
  } = useRoute<RouteType<Params>>();

  const hasRenderedActivitiesOnce = useRef(false);

  const { address, tokens } = depot;

  useEffect(() => {
    if (
      !hasRenderedActivitiesOnce.current &&
      currentTab.key === Tabs.ACTIVITIES
    ) {
      hasRenderedActivitiesOnce.current = true;
    }
  }, [currentTab]);

  // Tab uses zIndex stack style to "cache" view
  const getTabStackOrder = useCallback(
    (tab: Tabs) => (currentTab.key === tab ? tab : -1),
    [currentTab.key]
  );

  // Wait for activities to be requested at least once before rendering
  const shouldRenderActivities = useMemo(
    () =>
      hasRenderedActivitiesOnce.current || currentTab.key === Tabs.ACTIVITIES,
    [currentTab.key]
  );

  const onPressMore = () => {
    showActionSheetWithOptions(
      {
        options: ['View on Blockscout', 'Cancel'],
        cancelButtonIndex: 1,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          Linking.openURL(`${blockExplorer}/address/${address}`);
        }
      }
    );
  };

  const onPressInformation = () => {
    navigate(Routes.MODAL_SCREEN, {
      address: depot.address,
      type: 'copy_address',
    });
  };

  return (
    <SafeAreaView backgroundColor="black" edges={['top']} flex={1}>
      <Container
        paddingTop={5}
        paddingHorizontal={5}
        justifyContent="space-between"
      >
        <CenteredContainer flexDirection="row" justifyContent="space-between">
          <Icon
            color="teal"
            iconSize="medium"
            name="chevron-left-no-box"
            onPress={goBack}
          />
          <Container alignItems="center">
            <Text color="white" weight="bold" textAlign="center">
              Depot
            </Text>
            <Touchable
              onPress={onPressInformation}
              flexDirection="row"
              alignItems="center"
            >
              <Text
                fontFamily="RobotoMono-Regular"
                color="white"
                size="xs"
                marginRight={2}
              >
                {getAddressPreview(address)}
              </Text>
              <Icon name="info" size={15} />
            </Touchable>
          </Container>
          <Icon name="more-horizontal" color="teal" onPress={onPressMore} />
        </CenteredContainer>
      </Container>
      <TabHeader />
      <Container flex={1} width="100%" backgroundColor="white">
        <AbsoluteFullScreenContainer
          flex={1}
          backgroundColor="white"
          zIndex={getTabStackOrder(Tabs.BALANCES)}
        >
          <BalanceSection isDepot tokens={tokens} safeAddress={address} />
        </AbsoluteFullScreenContainer>
        <Container
          flex={1}
          backgroundColor="white"
          zIndex={getTabStackOrder(Tabs.ACTIVITIES)}
        >
          {shouldRenderActivities && <Activities depotAddress={address} />}
        </Container>
      </Container>
    </SafeAreaView>
  );
}

const Activities = React.memo(({ depotAddress }: { depotAddress: string }) => {
  const {
    sections,
    isFetchingMore,
    onEndReached,
    refetchLoading,
    refetch,
    isLoadingTransactions,
  } = useDepotTransactions(depotAddress);

  return (
    <Container marginTop={7} flexDirection="column" width="100%">
      <SectionList
        stickySectionHeadersEnabled
        ListEmptyComponent={
          isLoadingTransactions ? (
            <TransactionListLoading light />
          ) : (
            <ListEmptyComponent text="No transactions" />
          )
        }
        ListFooterComponent={
          isFetchingMore ? <ActivityIndicator color="white" /> : null
        }
        contentContainerStyle={listStyle.sheetHeightPaddingBottom}
        renderItem={props => <TransactionItem {...props} includeBorder />}
        sections={sections}
        renderSectionHeader={({ section: { title } }) => (
          <Container
            paddingVertical={2}
            paddingHorizontal={5}
            width="100%"
            backgroundColor="white"
          >
            <Text size="medium">{title}</Text>
          </Container>
        )}
        refreshControl={
          <RefreshControl
            tintColor={colors.borderBlue}
            refreshing={refetchLoading}
            onRefresh={refetch}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        style={listStyle.fullWidth}
      />
    </Container>
  );
});

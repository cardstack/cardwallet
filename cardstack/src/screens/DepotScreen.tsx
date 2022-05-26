import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  SectionList,
  StatusBar,
} from 'react-native';

import {
  BalanceSection,
  CenteredContainer,
  Container,
  Icon,
  ListEmptyComponent,
  Text,
  Touchable,
  TransactionItem,
  TransactionListLoading,
} from '@cardstack/components';
import { useDepotTransactions } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { colors } from '@cardstack/theme';
import { DepotType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { sectionStyle } from '@cardstack/utils/layouts';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

import { BackButton } from '../../../src/components/header';

interface Params {
  depot: DepotType;
}

enum Tabs {
  BALANCES = 'Balances',
  ACTIVITIES = 'Activities',
}

export default function DepotScreen() {
  const { goBack, navigate } = useNavigation();
  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);
  const [selectedTab, setSelectedTab] = useState(Tabs.BALANCES);

  const {
    params: { depot },
  } = useRoute<RouteType<Params>>();

  const { address, tokens } = depot;

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
    <Container top={0} width="100%" backgroundColor="white">
      <StatusBar barStyle="light-content" />
      <Container height="100%" justifyContent="flex-end">
        <Container paddingTop={14} backgroundColor="black">
          <Container paddingTop={1}>
            <CenteredContainer flexDirection="row">
              <Container left={0} position="absolute">
                <BackButton
                  color="teal"
                  direction="left"
                  onPress={goBack}
                  testID="goToBalancesFromScanner"
                  throttle={false}
                  textChevron={false}
                />
              </Container>
              <Container alignItems="center">
                <Text color="white" weight="bold">
                  Depot
                </Text>
                <Touchable onPress={onPressInformation}>
                  <Container flexDirection="row" alignItems="center">
                    <Text
                      fontFamily="RobotoMono-Regular"
                      color="white"
                      size="xs"
                      marginRight={2}
                    >
                      {getAddressPreview(address)}
                    </Text>
                    <Icon name="info" size={15} />
                  </Container>
                </Touchable>
              </Container>
              <Container right={20} position="absolute">
                <Touchable onPress={onPressMore}>
                  <Icon name="more-horizontal" color="teal" />
                </Touchable>
              </Container>
            </CenteredContainer>
          </Container>
          <Container
            flexDirection="row"
            style={{ paddingHorizontal: '10%' }}
            justifyContent="space-between"
          >
            <TabHeader
              tab={Tabs.BALANCES}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <TabHeader
              tab={Tabs.ACTIVITIES}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </Container>
        </Container>
        <Container flex={1} width="100%">
          <Container
            flex={1}
            width="100%"
            height="100%"
            backgroundColor="white"
            position="absolute"
            zIndex={selectedTab === Tabs.BALANCES ? 1 : 0}
          >
            <BalanceSection tokens={tokens} safeAddress={address} />
          </Container>
          <Container
            flex={1}
            width="100%"
            height="100%"
            backgroundColor="white"
            position="absolute"
            zIndex={selectedTab === Tabs.ACTIVITIES ? 1 : 0}
          >
            <Activities />
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

interface TabHeaderProps {
  setSelectedTab: (tab: Tabs) => void;
  selectedTab: Tabs;
  tab: Tabs;
}

const TabHeader = ({ tab, selectedTab, setSelectedTab }: TabHeaderProps) => {
  const isSelected = selectedTab === tab;
  return (
    <Touchable
      alignItems="center"
      justifyContent="center"
      width="40%"
      paddingTop={5}
      onPress={() => setSelectedTab(tab)}
    >
      <Text
        color="white"
        marginBottom={3}
        weight={isSelected ? 'bold' : 'regular'}
      >
        {tab}
      </Text>
      <Container
        backgroundColor={isSelected ? 'teal' : 'transparent'}
        height={4}
        width="100%"
      />
    </Touchable>
  );
};

const Activities = () => {
  const {
    params: { depot },
  } = useRoute<RouteType<Params>>();

  const { address } = depot;

  const {
    sections,
    isFetchingMore,
    onEndReached,
    refetchLoading,
    refetch,
    isLoadingTransactions,
  } = useDepotTransactions(address);

  return (
    <Container marginTop={7} flexDirection="column" width="100%">
      {isLoadingTransactions ? (
        <TransactionListLoading light />
      ) : (
        <SectionList
          ListEmptyComponent={<ListEmptyComponent text="No transactions" />}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator color="white" /> : null
          }
          contentContainerStyle={sectionStyle.contentContainerStyle}
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
          style={sectionStyle.sectionList}
        />
      )}
    </Container>
  );
};

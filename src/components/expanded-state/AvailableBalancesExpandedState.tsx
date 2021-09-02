import { add, convertAmountToNativeDisplay } from '@cardstack/cardpay-sdk';
import { get } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { SlackSheet } from '../sheet';
import {
  AssetList,
  AssetListSectionItem,
  Container,
  HorizontalDivider,
  Text,
  TokenBalance,
  TokenBalanceProps,
  Touchable,
} from '@cardstack/components';
import { MerchantSafeType, TokenType } from '@cardstack/types';
import { sortedByTokenBalanceAmount } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';

import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import Routes from '@rainbow-me/routes';

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

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  return (
    <SlackSheet flex={1} scrollEnabled={false}>
      <Container paddingHorizontal={5} paddingTop={3}>
        <Text size="medium">Available balances</Text>
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
        <Assets {...props} />
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

const Assets = (props: AvailableBalancesExpandedStateProps) => {
  const { tokens } = props.asset;

  const [network, nativeCurrency, currencyConversionRates] = useRainbowSelector<
    [string, string, { [key: string]: number }]
  >(state => [
    state.settings.network,
    state.settings.nativeCurrency,
    state.currencyConversion.rates,
  ]);
  const balancesSection = useBalancesSection(tokens);
  const orderedSections = [
    balancesSection,
    // ToDo: add more sections here later
  ];
  const sections = orderedSections.filter(section => section?.data?.length);

  const isEmpty = !sections.length;
  const isLoadingAssets = useRainbowSelector(
    state => state.data.isLoadingAssets
  );

  return (
    <Container paddingBottom={3} paddingHorizontal={5}>
      <AssetList
        backgroundColor="transparent"
        color="black"
        currencyConversionRates={currencyConversionRates}
        headerPaddingHorizontal={0}
        headerPaddingVertical={8}
        isEmpty={isEmpty}
        loading={isLoadingAssets}
        nativeCurrency={nativeCurrency}
        network={network}
        sections={sections}
      />
    </Container>
  );
};

const useBalancesSection = (
  tokens: TokenType[]
): AssetListSectionItem<TokenBalanceProps> => {
  const [nativeCurrency] = useNativeCurrencyAndConversionRates();
  const { navigate } = useNavigation();

  const assets = useMemo(
    () =>
      sortedByTokenBalanceAmount(tokens).map((token: TokenType) => ({
        tokenSymbol: token.token.symbol,
        tokenBalance: token.balance.display,
        nativeBalance: token.native.balance.display,
        onPress: () =>
          navigate(Routes.EXPANDED_ASSET_SHEET, {
            asset: token,
            type: 'token',
          }),
        key: token.tokenAddress,
        tokenBalanceFontSize: 'largeBalance',
      })),
    [navigate, tokens]
  );

  const totalDisplay = useMemo(
    () =>
      convertAmountToNativeDisplay(
        tokens.reduce(
          (total, token) => add(total, get(token, 'native.balance.amount', 0)),
          '0'
        ),
        nativeCurrency
      ),
    [tokens, nativeCurrency]
  );

  return {
    header: {
      title: 'Balances',
      count: assets.length,
      total: totalDisplay,
    },
    data: assets,
    Component: TokenBalance,
  };
};

const Activities = (_props: AvailableBalancesExpandedStateProps) => {
  return (
    <Container paddingBottom={3} paddingHorizontal={5}>
      <Container alignItems="center" width="100%">
        <Text marginBottom={3} marginTop={8} weight="bold">
          No data to show
        </Text>
      </Container>
    </Container>
  );
};

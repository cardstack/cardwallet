import React, { useEffect, useState } from 'react';
import { SlackSheet } from '../sheet';
import {
  Container,
  HorizontalDivider,
  Text,
  TokenBalance,
  Touchable,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

const CHART_HEIGHT = 650;

enum Tabs {
  BALANCES = 'Balances',
  ACTIVITIES = 'Activities',
}

interface AvailableBalancesExpandedStateProps {
  asset: MerchantSafeType;
}

export default function AvailableBalancesExpandedState(
  props: AvailableBalancesExpandedStateProps
) {
  const { setOptions } = useNavigation();
  const [selectedTab, setSelectedTab] = useState(Tabs.BALANCES);

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  return (
    // @ts-ignore
    <SlackSheet
      additionalTopPadding={android}
      contentHeight={CHART_HEIGHT}
      scrollEnabled
    >
      <Container paddingHorizontal={5} paddingTop={3}>
        <Text size="medium">Available balances</Text>
        <Container flexDirection="row" justifyContent="space-between">
          <TabHeader
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tab={Tabs.BALANCES}
          />
          <TabHeader
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tab={Tabs.ACTIVITIES}
          />
        </Container>
      </Container>
      <HorizontalDivider marginVertical={0} />
      {selectedTab === Tabs.BALANCES ? (
        <Balances {...props} />
      ) : (
        <Activities {...props} />
      )}
    </SlackSheet>
  );
}

interface TabHeaderProps {
  setSelectedTab: (_tab: Tabs) => void;
  selectedTab: Tabs;
  tab: Tabs;
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

const Balances = (props: AvailableBalancesExpandedStateProps) => {
  const { tokens } = props.asset;
  const { navigate } = useNavigation();

  const onPress = (token: any) => {
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: token,
      type: 'token',
    });
  };

  return (
    <Container paddingBottom={3} paddingHorizontal={5}>
      <Text marginBottom={3} marginTop={8} variant="subText">
        Tokens
      </Text>
      {tokens.map(token => (
        <TokenBalance
          includeBorder
          key={token.tokenAddress}
          nativeBalance={token.native.balance.display}
          onPress={() => onPress(token)}
          tokenBalance={token.balance.display}
          tokenSymbol={token.token.symbol}
        />
      ))}
    </Container>
  );
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

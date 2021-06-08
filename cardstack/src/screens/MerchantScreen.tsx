import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Linking, StatusBar } from 'react-native';
import {
  Button,
  CenteredContainer,
  Container,
  HorizontalDivider,
  Icon,
  NetworkBadge,
  ScrollView,
  Text,
  TokenBalance,
  Touchable,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import Routes from '@rainbow-me/routes';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

interface RouteType {
  params: { merchantSafe: MerchantSafeType };
  key: string;
  name: string;
}

export default function MerchantScreen() {
  return (
    <Container top={0} width="100%" backgroundColor="white">
      <StatusBar barStyle="light-content" />
      <Header />
      <Container height="100%" justifyContent="flex-end" paddingBottom={4}>
        <ScrollView
          flex={1}
          width="100%"
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 180 }}
          paddingHorizontal={5}
        >
          <MerchantInfo />
          <Button marginTop={2} marginBottom={4}>
            Request Payment
          </Button>
          <HorizontalDivider />
          <LifetimeEarningsSection />
          <UnclaimedRevenueSection />
          <AvailableBalancesSection />
        </ScrollView>
      </Container>
    </Container>
  );
}

const Header = () => {
  const { goBack } = useNavigation();

  const {
    params: { merchantSafe },
  } = useRoute<RouteType>();

  const { address } = merchantSafe;
  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);

  const onPressInformation = () => {
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

  return (
    <Container paddingTop={14} backgroundColor="black">
      <Container>
        <CenteredContainer flexDirection="row">
          <Touchable onPress={goBack} left={12} position="absolute">
            <Icon name="chevron-left" color="blue" size={30} />
          </Touchable>
          <Container alignItems="center">
            <Text color="white" weight="bold">
              Mandello
            </Text>
            <Container flexDirection="row" alignItems="center">
              <NetworkBadge networkName={network} />
              <Text
                fontFamily="RobotoMono-Regular"
                color="white"
                size="xs"
                marginRight={2}
              >
                {getAddressPreview(address)}
              </Text>
            </Container>
          </Container>
        </CenteredContainer>
      </Container>
      <Container
        alignItems="center"
        flexDirection="row"
        paddingVertical={4}
        paddingHorizontal={5}
        justifyContent="space-between"
      >
        <Text color="white" size="medium">
          Merchant account
        </Text>
        <Container>
          <Touchable onPress={onPressInformation}>
            <Icon name="more-circle" color="blue" iconSize="medium" />
          </Touchable>
        </Container>
      </Container>
    </Container>
  );
};

const MerchantInfo = () => (
  <Container
    width="100%"
    flexDirection="column"
    alignItems="center"
    paddingVertical={5}
  >
    <Icon name="mandello" size={80} />
    <Text weight="extraBold" size="medium">
      Mandello
    </Text>
    <Text variant="subText">Merchant account</Text>
    <Container flexDirection="row" marginTop={2}>
      <Text weight="extraBold" size="xs">
        1{' '}
        <Text weight="regular" size="xs">
          owner
        </Text>
      </Text>
      <Icon name="user" color="black" iconSize="small" marginLeft={2} />
    </Container>
  </Container>
);

const LifetimeEarningsSection = () => {
  const {
    params: { merchantSafe },
  } = useRoute<RouteType>();

  const { navigate } = useNavigation();

  const { accumulatedSpendValue } = merchantSafe;

  const nativeCurrency = useRainbowSelector(
    state => state.settings.nativeCurrency
  );

  const {
    tokenBalanceDisplay,
    nativeBalanceDisplay,
  } = convertSpendForBalanceDisplay(accumulatedSpendValue, nativeCurrency);

  const onPress = () =>
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: merchantSafe,
      type: 'lifetimeEarnings',
    });

  return (
    <Container flexDirection="column" width="100%">
      <SectionHeader>Lifetime earnings</SectionHeader>
      <SectionWrapper onPress={onPress}>
        <TokenBalance
          Icon={<Icon name="spend" />}
          tokenSymbol="SPEND"
          tokenBalance={tokenBalanceDisplay}
          nativeBalance={nativeBalanceDisplay}
        />
      </SectionWrapper>
    </Container>
  );
};

const UnclaimedRevenueSection = () => {
  const {
    params: { merchantSafe },
  } = useRoute<RouteType>();

  const { navigate } = useNavigation();

  const { revenueBalances } = merchantSafe;

  const onPress = () =>
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: merchantSafe,
      type: 'unclaimedRevenue',
    });

  return (
    <Container flexDirection="column" width="100%">
      <SectionHeader>Unclaimed revenue</SectionHeader>
      <SectionWrapper onPress={onPress}>
        <>
          {revenueBalances.length ? (
            revenueBalances.map(token => (
              <TokenBalance
                tokenSymbol={token.token.symbol}
                tokenBalance={token.balance.display}
                nativeBalance={token.native.balance.display}
              />
            ))
          ) : (
            <EmptySection>No revenue to be claimed</EmptySection>
          )}
        </>
      </SectionWrapper>
    </Container>
  );
};

const AvailableBalancesSection = () => {
  const {
    params: { merchantSafe },
  } = useRoute<RouteType>();

  const { tokens } = merchantSafe;

  const { navigate } = useNavigation();

  const onPress = () =>
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: merchantSafe,
      type: 'availableBalances',
    });

  return (
    <Container flexDirection="column" width="100%">
      <SectionHeader>Available balances</SectionHeader>
      <SectionWrapper onPress={onPress}>
        <>
          {tokens.length ? (
            tokens.map(token => (
              <TokenBalance
                tokenSymbol={token.token.symbol}
                tokenBalance={token.balance.display}
                nativeBalance={token.native.balance.display}
              />
            ))
          ) : (
            <EmptySection>No available assets</EmptySection>
          )}
        </>
      </SectionWrapper>
    </Container>
  );
};

const SectionHeader = ({ children }: { children: string }) => (
  <Text marginBottom={3} marginTop={4} size="medium">
    {children}
  </Text>
);

const SectionWrapper = ({
  children,
  onPress,
}: {
  children: JSX.Element;
  onPress?: () => void;
}) => (
  <Touchable
    width="100%"
    borderColor="buttonPrimaryBorder"
    borderRadius={10}
    borderWidth={1}
    padding={4}
    onPress={onPress}
  >
    <Container position="absolute" top={8} right={8}>
      <Text size="xs">Details</Text>
    </Container>
    {children}
  </Touchable>
);

const EmptySection = ({ children }: { children: string }) => (
  <Container>
    <Text variant="subText">{children}</Text>
  </Container>
);

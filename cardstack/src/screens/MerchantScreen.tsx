import { useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';
import { useLifetimeEarningsData } from '../hooks/use-lifetime-earnings-data';
import { ContactAvatar } from '../../../src/components/contacts';
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
import { palette, SPACING_MULTIPLIER } from '@cardstack/theme';
import { MerchantSafeType, TokenType } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
  sortedByTokenBalanceAmount,
} from '@cardstack/utils';
import { ChartPath } from '@rainbow-me/animated-charts';
import { useNavigation } from '@rainbow-me/navigation';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import Routes from '@rainbow-me/routes';
import { useDimensions } from '@rainbow-me/hooks';

const HORIZONTAL_PADDING = 5;
const HORIZONTAL_PADDING_PIXELS = HORIZONTAL_PADDING * SPACING_MULTIPLIER;
const TOTAL_HORIZONTAL_PADDING = HORIZONTAL_PADDING_PIXELS * 2;

const isLastItem = (items: TokenType[], index: number): boolean =>
  items.length - 1 === index;

interface RouteType {
  params: { merchantSafe: MerchantSafeType };
  key: string;
  name: string;
}


const useMerchantSafe = () => {
  const {
    params: {
      merchantSafe: { address },
    },
  } = useRoute<RouteType>();

  const merchantSafes = useRainbowSelector(state => state.data.merchantSafes);

  const merchantSafe = merchantSafes.find(
    safe => safe.address === address
  ) as MerchantSafeType;

  return merchantSafe;
};

export default function MerchantScreen() {
  const { navigate } = useNavigation();
  const merchantSafe = useMerchantSafe();

  const onPressRequestPayment = useCallback(() => {
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: merchantSafe,
      type: 'paymentRequest',
    });
  }, [merchantSafe, navigate]);

  return (
    <Container top={0} width="100%" backgroundColor="white">
      <StatusBar barStyle="light-content" />
      <Header />
      <Container height="100%" justifyContent="flex-end" paddingBottom={4}>
        <ScrollView
          flex={1}
          width="100%"
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 400 }}
          paddingHorizontal={HORIZONTAL_PADDING}
        >
          <MerchantInfo />
          <Button marginTop={2} marginBottom={4} onPress={onPressRequestPayment}>
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
  const { goBack, navigate } = useNavigation();
  const merchantSafe = useMerchantSafe();

  const onPressInformation = useCallback(() => {
    navigate(Routes.MODAL_SCREEN, {
      address: merchantSafe.address,
      type: 'copy_address',
    });
  }, [merchantSafe.address, navigate]);

  return (
    <Container paddingTop={14} backgroundColor="black">
      <Container>
        <CenteredContainer flexDirection="row">
          <Touchable onPress={goBack} left={12} position="absolute">
            <Icon name="chevron-left" color="teal" size={30} />
          </Touchable>
          <Container alignItems="center" width="80%">
            <Text
              color="white"
              weight="bold"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {merchantSafe?.merchantInfo?.name || ''}
            </Text>
            <Container flexDirection="row" alignItems="center">
              <NetworkBadge marginRight={2} />
              <Touchable onPress={onPressInformation}>
                <Container flexDirection="row" alignItems="center">
                  <Text
                    fontFamily="RobotoMono-Regular"
                    color="white"
                    size="xs"
                    marginRight={2}
                  >
                    {getAddressPreview(merchantSafe.address)}
                  </Text>
                  <Icon name="info" size={15} />
                </Container>
              </Touchable>
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
            <Icon name="more-circle" iconSize="large" />
          </Touchable>
        </Container>
      </Container>
    </Container>
  );
};

const MerchantInfo = () => {
  const {
    params: { merchantSafe },
  } = useRoute<RouteType>();

  return (
    <Container
      width="100%"
      flexDirection="column"
      alignItems="center"
      paddingVertical={5}
    >
      {merchantSafe.merchantInfo ? (
        <ContactAvatar
          color={merchantSafe.merchantInfo?.color}
          size="large"
          value={merchantSafe.merchantInfo?.name}
          textColor={merchantSafe.merchantInfo?.['text-color']}
        />
      ) : (
        <Icon name="user" size={80} />
      )}

      <Text
        weight="extraBold"
        size="medium"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {merchantSafe.merchantInfo?.name || ''}
      </Text>
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
};

const LifetimeEarningsSection = () => {
  const merchantSafe = useMerchantSafe();

  const { navigate } = useNavigation();
  const { width: screenWidth } = useDimensions();

  const { accumulatedSpendValue } = merchantSafe;

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const { data } = useLifetimeEarningsData(merchantSafe.address);

  const {
    tokenBalanceDisplay,
    nativeBalanceDisplay,
  } = convertSpendForBalanceDisplay(
    accumulatedSpendValue,
    nativeCurrency,
    currencyConversionRates
  );

  const onPress = () =>
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: merchantSafe,
      type: 'lifetimeEarnings',
    });

  return (
    <Container flexDirection="column" width="100%">
      <SectionHeader>Lifetime earnings</SectionHeader>
      <SectionWrapper onPress={onPress}>
        <>
          <TokenBalance
            Icon={<Icon name="spend" />}
            tokenSymbol="SPEND"
            tokenBalance={tokenBalanceDisplay}
            nativeBalance={nativeBalanceDisplay}
          />
          <Container alignItems="center" justifyContent="center" width="100%">
            <ChartPath
              data={{ points: data, smoothingStrategy: 'bezier' }}
              gestureEnabled={false}
              height={125}
              stroke={palette.tealDark}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3.5}
              width={screenWidth - TOTAL_HORIZONTAL_PADDING}
            >
              <Container />
            </ChartPath>
          </Container>
        </>
      </SectionWrapper>
    </Container>
  );
};

const UnclaimedRevenueSection = () => {
  const merchantSafe = useMerchantSafe();

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
            sortedByTokenBalanceAmount(revenueBalances).map((token, index) => (
              <TokenBalance
                tokenSymbol={token.token.symbol}
                tokenBalance={token.balance.display}
                nativeBalance={token.native.balance.display}
                key={token.tokenAddress}
                isLastItemIfList={isLastItem(revenueBalances, index)}
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
  const merchantSafe = useMerchantSafe();

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
            sortedByTokenBalanceAmount(tokens).map((token, index) => (
              <TokenBalance
                tokenSymbol={token.token.symbol}
                tokenBalance={token.balance.display}
                nativeBalance={token.native.balance.display}
                key={token.tokenAddress}
                isLastItemIfList={isLastItem(tokens, index)}
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
    borderColor="borderGray"
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

import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Alert, StatusBar } from 'react-native';
import {
  useLifetimeEarningsData,
  useMerchantTransactions,
} from '@cardstack/hooks';
import { ContactAvatar } from '@rainbow-me/components/contacts';
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
  TransactionItem,
} from '@cardstack/components';
import { palette, SPACING_MULTIPLIER } from '@cardstack/theme';
import {
  MerchantEarnedSpendTransactionType,
  MerchantInformation,
  MerchantSafeType,
  TokenType,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
  sortedByTokenBalanceAmount,
} from '@cardstack/utils';
import { ChartPath } from '@rainbow-me/animated-charts';
import { useNavigation } from '@rainbow-me/navigation';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import Routes from '@rainbow-me/routes';
import {
  useAccountSettings,
  useDimensions,
  usePrevious,
  useWallets,
} from '@rainbow-me/hooks';
import { useLoadingOverlay } from '@cardstack/navigation';
import {
  useClaimRevenueMutation,
  useGetSafesDataQuery,
} from '@cardstack/services';
import logger from 'logger';

const HORIZONTAL_PADDING = 5;
const HORIZONTAL_PADDING_PIXELS = HORIZONTAL_PADDING * SPACING_MULTIPLIER;
const TOTAL_HORIZONTAL_PADDING = HORIZONTAL_PADDING_PIXELS * 2;

const isLastItem = (items: TokenType[], index: number): boolean =>
  items.length - 1 === index;

interface MerchantSafeProps {
  merchantSafe: MerchantSafeType;
}
interface RouteType {
  params: MerchantSafeProps;
  key: string;
  name: string;
}

type onPressProps = {
  onPress: () => void;
};

export enum ExpandedMerchantRoutes {
  lifetimeEarnings = 'lifetimeEarnings',
  unclaimedRevenue = 'unclaimedRevenue',
  availableBalances = 'availableBalances',
  paymentRequest = 'paymentRequest',
  recentActivity = 'recentActivity',
}

const MerchantScreen = () => {
  const { navigate } = useNavigation();

  const {
    params: { merchantSafe: merchantSafeFallback },
  } = useRoute<RouteType>();

  const { accountAddress, nativeCurrency } = useAccountSettings();

  const { updatedMerchantSafe, isRefreshingBalances } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      selectFromResult: ({ data, isFetching }) => ({
        updatedMerchantSafe: data?.merchantSafes.find(
          (safe: MerchantSafeType) =>
            safe.address === merchantSafeFallback.address
        ),
        isRefreshingBalances: isFetching,
      }),
    }
  );

  const merchantSafe = updatedMerchantSafe || merchantSafeFallback;

  const onClaimAllPress = useClaimAllRevenue({
    merchantSafe,
    isRefreshingBalances,
  });

  const onPressGoTo = useCallback(
    (type: ExpandedMerchantRoutes) => () => {
      navigate(Routes.EXPANDED_ASSET_SHEET, {
        asset: merchantSafe,
        type,
        customFunction:
          type === ExpandedMerchantRoutes.unclaimedRevenue
            ? onClaimAllPress
            : undefined,
      });
    },
    [merchantSafe, navigate, onClaimAllPress]
  );

  const { sections } = useMerchantTransactions(
    merchantSafe.address,
    'recentActivity'
  );

  return (
    <Container top={0} width="100%" backgroundColor="white">
      <StatusBar barStyle="light-content" />
      <Header
        address={merchantSafe.address}
        name={merchantSafe.merchantInfo?.name}
      />
      <Container height="100%" justifyContent="flex-end" paddingBottom={4}>
        <ScrollView
          flex={1}
          width="100%"
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 400 }}
          paddingHorizontal={HORIZONTAL_PADDING}
        >
          <MerchantInfo merchantInfo={merchantSafe.merchantInfo} />
          <Button
            marginTop={2}
            marginBottom={4}
            onPress={onPressGoTo(ExpandedMerchantRoutes.paymentRequest)}
          >
            Request Payment
          </Button>
          <HorizontalDivider />
          <RecentActivitySection
            sections={sections}
            onPress={onPressGoTo(ExpandedMerchantRoutes.recentActivity)}
          />
          <LifetimeEarningsSection
            merchantSafe={merchantSafe}
            onPress={onPressGoTo(ExpandedMerchantRoutes.lifetimeEarnings)}
          />
          <TokensSection
            title="Available revenue"
            onPress={onPressGoTo(ExpandedMerchantRoutes.unclaimedRevenue)}
            emptyText="No revenue to be claimed"
            tokens={merchantSafe.revenueBalances}
          />
          <TokensSection
            title="Account balances"
            onPress={onPressGoTo(ExpandedMerchantRoutes.availableBalances)}
            emptyText="No available assets"
            tokens={merchantSafe.tokens}
          />
        </ScrollView>
      </Container>
    </Container>
  );
};

export default memo(MerchantScreen);

const Header = ({ address, name }: { address: string; name?: string }) => {
  const { goBack, navigate } = useNavigation();

  const onPressInformation = useCallback(() => {
    navigate(Routes.MODAL_SCREEN, {
      address,
      type: 'copy_address',
    });
  }, [address, navigate]);

  return (
    <Container paddingTop={14} backgroundColor="black">
      <Container paddingBottom={6}>
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
              {name || ''}
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
                    {getAddressPreview(address)}
                  </Text>
                  <Icon name="info" size={15} />
                </Container>
              </Touchable>
            </Container>
          </Container>
        </CenteredContainer>
      </Container>
    </Container>
  );
};

const MerchantInfo = ({
  merchantInfo,
}: {
  merchantInfo?: MerchantInformation;
}) => {
  return (
    <Container
      width="100%"
      flexDirection="column"
      alignItems="center"
      paddingVertical={5}
    >
      {merchantInfo ? (
        <Container marginBottom={3}>
          <ContactAvatar
            color={merchantInfo?.color}
            size="large"
            value={merchantInfo?.name}
            textColor={merchantInfo?.textColor}
          />
        </Container>
      ) : (
        <Icon name="user" size={80} />
      )}

      <Text
        weight="extraBold"
        size="medium"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {merchantInfo?.name || ''}
      </Text>
      <Text variant="subText">Business Account</Text>
      <Container flexDirection="row" marginTop={2}>
        <Text weight="extraBold" size="xs">
          1{' '}
          <Text weight="regular" size="xs">
            manager
          </Text>
        </Text>
        <Icon name="user" color="black" iconSize="small" marginLeft={2} />
      </Container>
    </Container>
  );
};

const LifetimeEarningsSection = ({
  merchantSafe,
  onPress,
}: MerchantSafeProps & onPressProps) => {
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

  return (
    <Container flexDirection="column" width="100%">
      <SectionHeader>Earnings history</SectionHeader>
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

interface TokensSectionProps extends onPressProps {
  title: string;
  tokens: TokenType[];
  emptyText: string;
}

const TokensSection = ({
  title,
  onPress,
  tokens,
  emptyText,
}: TokensSectionProps) => {
  const renderTokens = useMemo(
    () =>
      sortedByTokenBalanceAmount(tokens).map((token, index) => (
        <TokenBalance
          tokenSymbol={token.token.symbol}
          tokenBalance={token.balance.display}
          nativeBalance={token.native.balance.display}
          key={token.tokenAddress}
          isLastItemIfList={isLastItem(tokens, index)}
        />
      )),
    [tokens]
  );

  return (
    <Container flexDirection="column" width="100%">
      <SectionHeader>{title}</SectionHeader>
      <SectionWrapper onPress={onPress}>
        <>
          {tokens.length ? (
            renderTokens
          ) : (
            <Text variant="subText">{emptyText}</Text>
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

export interface RecentActivityDataSectionProps {
  data: MerchantEarnedSpendTransactionType[];
  title: string;
}

const RecentActivitySection = ({
  sections,
  onPress,
}: {
  sections: RecentActivityDataSectionProps[];
  onPress: () => void;
}) => {
  const firstActivityDataListItem = sections[0]?.data[0];

  const recentActivityDataSectionData = {
    item: firstActivityDataListItem,
    onPressTransaction: onPress,
  };

  return (
    <Container flexDirection="column" width="100%">
      <SectionHeader>Transactions</SectionHeader>
      {sections[0]?.data.length > 0 ? (
        <TransactionItem
          {...recentActivityDataSectionData}
          includeBorder
          isFullWidth
        />
      ) : (
        <SectionWrapper>
          <Text variant="subText">No recent activity</Text>
        </SectionWrapper>
      )}
    </Container>
  );
};

const useClaimAllRevenue = ({
  merchantSafe,
  isRefreshingBalances,
}: {
  merchantSafe: MerchantSafeType;
  isRefreshingBalances: boolean;
}) => {
  const { selectedWallet } = useWallets();
  const { accountAddress, network } = useAccountSettings();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const [
    claimRevenue,
    { isSuccess, isError, error },
  ] = useClaimRevenueMutation();

  const onClaimAllPress = useCallback(async () => {
    showLoadingOverlay({ title: 'Claiming Revenue' });

    claimRevenue({
      selectedWallet,
      revenueBalances: merchantSafe.revenueBalances,
      accountAddress,
      merchantSafeAddress: merchantSafe.address,
      network,
    });
  }, [
    accountAddress,
    claimRevenue,
    merchantSafe.address,
    merchantSafe.revenueBalances,
    network,
    selectedWallet,
    showLoadingOverlay,
  ]);

  // isRefreshing may be false when isSuccess is truthy on the first time
  // so we use the previous value to make sure
  const hasUpdated = usePrevious(isRefreshingBalances);

  useEffect(() => {
    if (isSuccess && hasUpdated) {
      dismissLoadingOverlay();
    }
  }, [dismissLoadingOverlay, isSuccess, hasUpdated]);

  useEffect(() => {
    if (isError) {
      dismissLoadingOverlay();
      logger.sentry('Error claiming revenue', error);
      Alert.alert(
        'Could not claim revenue, please try again. If this problem persists please reach out to support@cardstack.com'
      );
    }
  }, [dismissLoadingOverlay, error, isError]);

  return onClaimAllPress;
};

import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { useClaimAllRevenue } from './sheets/UnclaimedRevenue/useClaimAllRevenue';
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
} from '@cardstack/components';
import {
  MerchantInformation,
  MerchantSafeType,
  TokenType,
} from '@cardstack/types';
import {
  getAddressPreview,
  sortedByTokenBalanceAmount,
} from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { useAccountSettings } from '@rainbow-me/hooks';
import { useGetSafesDataQuery } from '@cardstack/services';
import { RouteType } from '@cardstack/navigation/types';

const HORIZONTAL_PADDING = 5;

const isLastItem = (items: TokenType[], index: number): boolean =>
  items.length - 1 === index;

interface MerchantSafeProps {
  merchantSafe: MerchantSafeType;
}

type onPressProps = {
  onPress: () => void;
};

export enum ExpandedMerchantRoutes {
  lifetimeEarnings = 'lifetimeEarnings',
  availableBalances = 'availableBalances',
}

const MerchantScreen = () => {
  const { navigate } = useNavigation();

  const {
    params: { merchantSafe: merchantSafeFallback },
  } = useRoute<RouteType<MerchantSafeProps>>();

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
      });
    },
    [merchantSafe, navigate]
  );

  const goToMerchantPaymentRequest = useCallback(
    () =>
      navigate(Routes.MERCHANT_PAYMENT_REQUEST_SHEET, {
        address: merchantSafe.address,
        merchantInfo: merchantSafe.merchantInfo,
      }),
    [merchantSafe, navigate]
  );

  const goToUnclaimedRevenue = useCallback(
    () =>
      navigate(Routes.UNCLAIMED_REVENUE_SHEET, {
        merchantSafe,
        onClaimAllPress,
      }),
    [onClaimAllPress, merchantSafe, navigate]
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
          width="100%"
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 260 }}
          paddingHorizontal={HORIZONTAL_PADDING}
        >
          <MerchantInfo merchantInfo={merchantSafe.merchantInfo} />
          <Button
            marginTop={2}
            marginBottom={4}
            onPress={goToMerchantPaymentRequest}
          >
            Request Payment
          </Button>
          <HorizontalDivider />
          <TokensSection
            title="Ready to Claim"
            onPress={goToUnclaimedRevenue}
            emptyText="No pending payments"
            tokens={merchantSafe.revenueBalances}
          />
          <TokensSection
            title="Your Available Balance"
            onPress={onPressGoTo(ExpandedMerchantRoutes.availableBalances)}
            emptyText="No balance available"
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
        <Icon name="user-with-background" size={80} />
      )}

      <Text
        weight="extraBold"
        size="medium"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {merchantInfo?.name || ''}
      </Text>
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
  const hasTokens = !!tokens?.length;

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
      <SectionWrapper onPress={onPress} disabled={!hasTokens}>
        <>
          {hasTokens ? (
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

interface SectionWrapperProps {
  children: JSX.Element;
  onPress?: () => void;
  disabled?: boolean;
  hasDetailsText?: boolean;
}

const SectionWrapper = ({
  children,
  onPress,
  disabled = false,
  hasDetailsText = true,
}: SectionWrapperProps) => (
  <Touchable
    width="100%"
    borderColor="borderGray"
    borderRadius={10}
    borderWidth={1}
    padding={4}
    onPress={onPress}
    disabled={disabled}
  >
    {hasDetailsText && (
      <Container position="absolute" top={8} right={8}>
        {!disabled && <Text size="xs">Details</Text>}
      </Container>
    )}
    {children}
  </Touchable>
);

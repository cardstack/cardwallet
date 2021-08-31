import React from 'react';
import { ContactAvatar } from '../../../../src/components/contacts';
import {
  Container,
  HorizontalDivider,
  Icon,
  MoreItemsFooter,
  SafeHeader,
  Text,
  TokenBalance,
  Touchable,
} from '@cardstack/components';
import { MerchantInformation, MerchantSafeType } from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

interface MerchantSafeProps extends MerchantSafeType {
  networkName: string;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  merchantInfo?: MerchantInformation;
}

const smallTokenSize = 30;

export const MerchantSafe = (props: MerchantSafeProps) => {
  const { navigate } = useNavigation();

  const onPress = () =>
    navigate(Routes.MERCHANT_SCREEN, { merchantSafe: props });

  return (
    <Container paddingHorizontal={4} marginBottom={4}>
      <Touchable testID="inventory-card" onPress={onPress}>
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
        >
          <SafeHeader {...props} onPress={onPress} />
          <Container paddingHorizontal={6}>
            <MerchantInfo {...props} />
            <Bottom {...props} />
          </Container>
        </Container>
      </Touchable>
    </Container>
  );
};

export const MerchantInfo = (props: MerchantSafeProps) => (
  <>
    <Container flexDirection="row" paddingVertical={8}>
      {props.merchantInfo ? (
        <ContactAvatar
          color={props.merchantInfo?.color}
          size="medium"
          value={props.merchantInfo?.name}
          textColor={props.merchantInfo?.textColor}
        />
      ) : (
        <Icon name="user" />
      )}

      <Container
        flexDirection="column"
        marginLeft={4}
        justifyContent="center"
        width="85%"
      >
        <Text weight="bold" ellipsizeMode="tail" numberOfLines={1}>
          {props.merchantInfo?.name || ''}
        </Text>
        <Text variant="subText">Merchant Account</Text>
      </Container>
    </Container>
  </>
);

const Bottom = (props: MerchantSafeProps) => {
  return (
    <Container paddingBottom={6}>
      <LifetimeEarningsSection {...props} />
      <HorizontalDivider />
      <UnclaimedRevenueSection {...props} />
      <HorizontalDivider />
      <AvailableBalancesSection {...props} />
    </Container>
  );
};

const LifetimeEarningsSection = ({
  accumulatedSpendValue,
  nativeCurrency,
  currencyConversionRates,
}: MerchantSafeProps) => {
  const {
    tokenBalanceDisplay,
    nativeBalanceDisplay,
  } = convertSpendForBalanceDisplay(
    accumulatedSpendValue,
    nativeCurrency,
    currencyConversionRates
  );

  return (
    <Container flexDirection="column">
      <SectionHeader>Lifetime earnings</SectionHeader>
      <TokenBalance
        Icon={<Icon name="spend" />}
        tokenSymbol="SPEND"
        tokenBalance={tokenBalanceDisplay}
        nativeBalance={nativeBalanceDisplay}
      />
    </Container>
  );
};

const UnclaimedRevenueSection = ({ revenueBalances }: MerchantSafeProps) => {
  const firstToken = revenueBalances.length ? revenueBalances[0] : null;

  return (
    <Container flexDirection="column">
      <SectionHeader>Unclaimed revenue</SectionHeader>
      {firstToken ? (
        <TokenBalance
          address={firstToken.tokenAddress}
          tokenSymbol={firstToken.token.symbol}
          tokenBalance={firstToken.balance.display}
          nativeBalance={firstToken.native.balance.display}
          size={smallTokenSize}
        />
      ) : (
        <EmptySection>No revenue to be claimed</EmptySection>
      )}
      <MoreItemsFooter tokens={revenueBalances} />
    </Container>
  );
};

const AvailableBalancesSection = ({ tokens }: MerchantSafeProps) => {
  const firstToken = tokens.length ? tokens[0] : null;

  return (
    <Container flexDirection="column">
      <SectionHeader>Available balances</SectionHeader>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {firstToken ? (
          <TokenBalance
            address={firstToken.tokenAddress}
            tokenSymbol={firstToken.token.symbol}
            tokenBalance={firstToken.balance.display}
            nativeBalance={firstToken.native.balance.display}
            size={smallTokenSize}
          />
        ) : (
          <EmptySection>No available assets</EmptySection>
        )}
      </Container>
      <MoreItemsFooter tokens={tokens} />
    </Container>
  );
};

const SectionHeader = ({ children }: { children: string }) => (
  <Text marginBottom={3}>{children}</Text>
);

const EmptySection = ({ children }: { children: string }) => (
  <Container>
    <Text variant="subText">{children}</Text>
  </Container>
);

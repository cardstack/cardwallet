import { useRoute, useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';

import {
  Button,
  CoinIcon,
  Container,
  HorizontalDivider,
  ListEmptyComponent,
  Sheet,
  Text,
  TransactionItem,
  TransactionListLoading,
} from '@cardstack/components';
import { useMerchantTransactions } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { MerchantSafeType, TokenType } from '@cardstack/types';
import { ClaimStatuses } from '@cardstack/utils';

interface Params {
  merchantSafe: MerchantSafeType;
  onClaimAllPress: () => void;
}

interface HeaderParams {
  merchantSafe: MerchantSafeType;
  onClaimPress: () => void;
}

const UnclaimedRevenueSheet = () => {
  const { navigate } = useNavigation();
  const { params } = useRoute<RouteType<Params>>();

  const openClaimWhereSheet = useCallback(
    () =>
      navigate(Routes.CONFIRM_CLAIM_DESTINY_SHEET, {
        onClaimAllPress: params.onClaimAllPress,
      }),
    [navigate, params.onClaimAllPress]
  );

  return (
    <Sheet
      Header={<Header onClaimPress={openClaimWhereSheet} {...params} />}
      scrollEnabled
      isFullScreen
    >
      <Container paddingHorizontal={5}>
        <ActivitiesList address={params.merchantSafe.address} />
      </Container>
    </Sheet>
  );
};

const Header = ({ merchantSafe, onClaimPress }: HeaderParams) => {
  const { revenueBalances } = merchantSafe;

  const nativeAmount = revenueBalances[0].native.balance.amount;

  const hasClaimableAmount = !!nativeAmount;

  const renderTokens = useMemo(
    () =>
      revenueBalances.map(token => (
        <TokenItem key={token.tokenAddress} token={token} />
      )),
    [revenueBalances]
  );

  return (
    <Container paddingHorizontal={5} paddingVertical={3}>
      <Text size="medium">Money Waiting</Text>
      <Container flexDirection="column" marginTop={5}>
        {renderTokens}
      </Container>
      <Button
        disabled={!hasClaimableAmount}
        marginTop={8}
        onPress={onClaimPress}
      >
        Claim
      </Button>
      <HorizontalDivider />
      <Text size="medium">History</Text>
    </Container>
  );
};

const sectionListStyle = { paddingBottom: 20 };

const ActivitiesList = ({ address }: { address: string }) => {
  const {
    sections,
    isFetchingMore,
    onEndReached,
    refetchLoading,
    refetch,
    isLoadingTransactions,
  } = useMerchantTransactions(address, 'unclaimedRevenue');

  const renderItem = useCallback(props => {
    const claimedProps = { ...props.item, claimStatus: ClaimStatuses.CLAIMED };

    return <TransactionItem item={claimedProps} includeBorder isFullWidth />;
  }, []);

  const renderSectionHeader = useCallback(
    ({ section: { title } }) => (
      <Container backgroundColor="white" paddingVertical={2} width="100%">
        <Text color="blueText" size="medium">
          {title}
        </Text>
      </Container>
    ),
    []
  );

  return (
    <SectionList
      ListEmptyComponent={
        isLoadingTransactions ? (
          <TransactionListLoading light removePadding />
        ) : (
          <ListEmptyComponent text="No activity" />
        )
      }
      ListFooterComponent={
        isFetchingMore ? <ActivityIndicator color="white" /> : null
      }
      contentContainerStyle={sectionListStyle}
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
      renderSectionHeader={renderSectionHeader}
      sections={sections}
    />
  );
};

const TokenItem = ({ token }: { token: TokenType }) => {
  const [balance, symbol] = token.balance.display.split(' ');
  return (
    <Container flexDirection="row">
      <CoinIcon size={40} symbol={token.token.symbol} />
      <Container flexDirection="column" marginLeft={4}>
        <Text size="largeBalance" weight="extraBold">
          {balance}
        </Text>
        <Text weight="extraBold">{symbol}</Text>
        <Text variant="subText">{token.native.balance.display}</Text>
      </Container>
    </Container>
  );
};

export default memo(UnclaimedRevenueSheet);

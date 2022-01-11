import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { SlackSheet } from '../sheet';
import {
  Button,
  CoinIcon,
  Container,
  HorizontalDivider,
  ListEmptyComponent,
  Text,
  TransactionItem,
  TransactionListLoading,
} from '@cardstack/components';
import { useMerchantTransactions } from '@cardstack/hooks';
import { MerchantSafeType, TokenType } from '@cardstack/types';
import { ClaimStatuses } from '@cardstack/utils';
import { sectionStyle } from '@cardstack/utils/layouts';
import { useNavigation } from '@rainbow-me/navigation';

const CHART_HEIGHT = 600;

interface Props {
  asset: MerchantSafeType;
  customFunction: () => void;
}

export default function UnclaimedRevenueExpandedState({
  asset: merchantSafe,
  customFunction: onClaimAll,
}: Props) {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  const { revenueBalances } = merchantSafe;

  const nativeAmount = revenueBalances[0].native.balance.amount;

  const isDust = !!nativeAmount;

  return useMemo(
    () => (
      <SlackSheet flex={1} scrollEnabled>
        <Container paddingHorizontal={5} paddingVertical={3}>
          <Text size="medium">Claim available revenue</Text>
          <Container flexDirection="column" marginTop={5}>
            {revenueBalances.map(token => (
              <TokenItem key={token.tokenAddress} token={token} />
            ))}
          </Container>
          <Button disabled={!isDust} marginTop={8} onPress={onClaimAll}>
            Claim All
          </Button>
          <HorizontalDivider />
          <Text size="medium">Activities</Text>
          <Activities address={merchantSafe.address} />
        </Container>
      </SlackSheet>
    ),
    [isDust, onClaimAll, merchantSafe, revenueBalances]
  );
}

const Activities = ({ address }: { address: string }) => {
  const {
    sections,
    isFetchingMore,
    onEndReached,
    refetchLoading,
    refetch,
    isLoadingTransactions,
  } = useMerchantTransactions(address, 'unclaimedRevenue');

  return (
    <Container flexDirection="column" marginTop={7} width="100%">
      {isLoadingTransactions ? (
        <TransactionListLoading light />
      ) : (
        <SectionList
          ListEmptyComponent={<ListEmptyComponent text="No activity" />}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator color="white" /> : null
          }
          contentContainerStyle={sectionStyle.contentContainerStyle}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          refreshControl={
            <RefreshControl
              onRefresh={refetch}
              refreshing={refetchLoading}
              tintColor="white"
            />
          }
          renderItem={props => {
            const claimedProps = {
              ...props,
              item: { ...props.item, claimStatus: ClaimStatuses.CLAIMED },
            };
            return (
              <TransactionItem {...claimedProps} includeBorder isFullWidth />
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Container backgroundColor="white" paddingVertical={2} width="100%">
              <Text color="blueText" size="medium">
                {title}
              </Text>
            </Container>
          )}
          sections={sections}
          style={sectionStyle.sectionList}
        />
      )}
    </Container>
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

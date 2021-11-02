import { getSDK } from '@cardstack/cardpay-sdk';
import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CoinIcon from 'react-coin-icon';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import Web3 from 'web3';
import { SlackSheet } from '../sheet';
import {
  Button,
  Container,
  HorizontalDivider,
  ListEmptyComponent,
  Text,
  TransactionItem,
  TransactionListLoading,
} from '@cardstack/components';
import { useMerchantTransactions } from '@cardstack/hooks';
import HDProvider from '@cardstack/models/hd-provider';
import Web3Instance from '@cardstack/models/web3-instance';
import { MerchantSafeType, TokenType } from '@cardstack/types';
import { sectionStyle } from '@cardstack/utils/layouts';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { fetchAssetsBalancesAndPrices } from '@rainbow-me/redux/fallbackExplorer';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import logger from 'logger';

const CHART_HEIGHT = 600;

export default function UnclaimedRevenueExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const merchantSafes = useRainbowSelector(state => state.data.merchantSafes);
  const merchantSafe = merchantSafes.find(
    safe => safe.address === props.asset.address
  ) as MerchantSafeType;
  const { setOptions } = useNavigation();
  const [loading, setLoading] = useState(false);
  const { selectedWallet } = useWallets();
  const { accountAddress } = useAccountSettings();

  const network = useRainbowSelector(
    state => state.settings.network
  ) as Network;

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  const { revenueBalances } = merchantSafe;

  const onClaimAll = useCallback(async () => {
    setLoading(true);

    try {
      const web3 = await Web3Instance.get({
        selectedWallet,
        network,
      });
      const revenuePool = await getSDK('RevenuePool', web3);
      const promises = revenueBalances.map(async token => {
        const claimEstimateAmount = Web3.utils.toWei(
          new BigNumber(token.balance.amount)
            .div(new BigNumber('2'))
            .toPrecision(8)
            .toString()
        );

        const gasEstimate = await revenuePool.claimGasEstimate(
          merchantSafe.address,
          token.tokenAddress,
          // divide amount by 2 for estimate since we can't estimate the full amount and the amount doesn't affect the gas price
          claimEstimateAmount
        );

        const claimAmount = new BigNumber(
          Web3.utils.toWei(token.balance.amount)
        )
          .minus(new BigNumber(gasEstimate))
          .toString();

        await revenuePool.claim(
          merchantSafe.address,
          token.tokenAddress,
          claimAmount,
          undefined,
          { from: accountAddress }
        );
      });

      await Promise.all(promises);

      // resets signed provider and web3 instance to kill poller
      await HDProvider.reset();

      await fetchAssetsBalancesAndPrices();
    } catch (error) {
      logger.sentry('Error claiming revenue', error);
    }

    setLoading(false);
  }, [
    accountAddress,
    merchantSafe.address,
    network,
    revenueBalances,
    selectedWallet,
  ]);

  const nativeAmount = revenueBalances[0].native.balance.amount;
  const isDust = parseFloat(nativeAmount) < 0.01;
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
          <Button
            loading={loading}
            marginTop={8}
            onPress={isDust ? () => {} : onClaimAll}
            variant={isDust ? 'disabled' : undefined}
          >
            Claim All
          </Button>
          <HorizontalDivider />
          <Text size="medium">Activities</Text>
          <Activities address={props.asset.address} />
        </Container>
      </SlackSheet>
    ),
    [isDust, loading, onClaimAll, props.asset, revenueBalances]
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
          renderItem={props => (
            <TransactionItem
              {...props}
              includeBorder
              isClaimedFromAvailableRevenue
              isFullWidth
            />
          )}
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

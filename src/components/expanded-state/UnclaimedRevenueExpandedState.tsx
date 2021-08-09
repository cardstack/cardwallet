import { getSDK } from '@cardstack/cardpay-sdk';
import HDWalletProvider from 'parity-hdwallet-provider';
import React, { useCallback, useEffect, useState } from 'react';
import CoinIcon from 'react-coin-icon';
import Web3 from 'web3';
import { getSeedPhrase } from '../../../src/model/wallet';
import { ethereumUtils } from '../../../src/utils';
import { SlackSheet } from '../sheet';
import {
  Button,
  Container,
  HorizontalDivider,
  Text,
} from '@cardstack/components';
import { MerchantSafeType, TokenType } from '@cardstack/types';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';
import { useWallets } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import logger from 'logger';

const CHART_HEIGHT = 600;

export default function UnclaimedRevenueExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const merchantSafe = props.asset;
  const { setOptions } = useNavigation();
  const [loading, setLoading] = useState(false);
  const { selectedWallet } = useWallets();
  const network = useRainbowSelector(state => state.settings.network);

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  const { revenueBalances } = merchantSafe;

  const onClaimAll = useCallback(async () => {
    setLoading(true);

    try {
      const seedPhrase = await getSeedPhrase(selectedWallet.id);
      const chainId = ethereumUtils.getChainIdFromNetwork(network);
      const hdProvider = new HDWalletProvider({
        chainId,
        mnemonic: {
          phrase: seedPhrase?.seedphrase || '',
        },
        providerOrUrl: web3ProviderSdk,
      });
      const web3 = new Web3(hdProvider);
      const revenuePool = await getSDK('RevenuePool', web3);

      const promises = revenueBalances.map(async token => {
        const gasEstimate = await revenuePool.claimGasEstimate(
          merchantSafe.address,
          token.tokenAddress,
          // divide amount by 2 for estimate since we can't estimate the full amount and the amoutn doesn't affect the gas price
          Web3.utils.toWei((Number(token.balance.amount) / 2).toString())
        );

        await revenuePool.claim(
          merchantSafe.address,
          token.tokenAddress,
          Web3.utils.toWei(
            (Number(token.balance.amount) - Number(gasEstimate)).toString()
          )
        );
      });

      await Promise.all(promises);
    } catch (error) {
      logger.sentry('Error claiming revenue', error);
    }

    setLoading(false);
  }, [merchantSafe.address, network, revenueBalances, selectedWallet.id]);

  return (
    <>
      {/* @ts-ignore */}
      <SlackSheet bottomInset={42} height="100%" scrollEnabled>
        <Container paddingHorizontal={5} paddingVertical={3}>
          <Text size="medium">Unclaimed revenue</Text>
          <Container flexDirection="column" marginTop={5}>
            {revenueBalances.map(token => (
              <TokenItem key={token.tokenAddress} token={token} />
            ))}
          </Container>
          <Button loading={loading} marginTop={8} onPress={onClaimAll}>
            Claim All
          </Button>
          <HorizontalDivider />
          <Text size="medium">Activities</Text>
          <Container alignItems="center" marginTop={4} width="100%">
            <Text>No activity data</Text>
          </Container>
        </Container>
      </SlackSheet>
    </>
  );
}

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

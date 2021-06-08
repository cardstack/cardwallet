import React, { useEffect } from 'react';
import CoinIcon from 'react-coin-icon';
import { SlackSheet } from '../sheet';
import {
  Button,
  Container,
  HorizontalDivider,
  Text,
} from '@cardstack/components';
import { MerchantSafeType, TokenType } from '@cardstack/types';
import { useNavigation } from '@rainbow-me/navigation';

const CHART_HEIGHT = 600;

export default function UnclaimedRevenueExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const merchantSafe = props.asset;
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  const { revenueBalances } = merchantSafe;

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
          <Button marginTop={8}>Claim All</Button>
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

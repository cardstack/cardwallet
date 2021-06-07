import React, { useEffect } from 'react';
import { SlackSheet } from '../sheet';
import { Container, Text, TokenBalance } from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import { useNavigation } from '@rainbow-me/navigation';

const CHART_HEIGHT = 400;

export default function AvailableBalancesExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const merchantSafe = props.asset;
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  const { tokens } = merchantSafe;

  return (
    // @ts-ignore
    <SlackSheet
      additionalTopPadding={android}
      contentHeight={CHART_HEIGHT}
      scrollEnabled
    >
      <Container paddingHorizontal={5} paddingVertical={3}>
        <Text size="medium">Available balances</Text>
        <Text marginBottom={3} marginTop={8} variant="subText">
          Tokens
        </Text>
        {tokens.map(token => (
          <TokenBalance
            includeBorder
            key={token.tokenAddress}
            nativeBalance={token.native.balance.display}
            tokenBalance={token.balance.display}
            tokenSymbol={token.token.symbol}
          />
        ))}
      </Container>
    </SlackSheet>
  );
}

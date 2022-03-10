import React, { useMemo } from 'react';
import {
  Container,
  Text,
  TokenBalance,
  SectionWrapper,
} from '@cardstack/components';
import { TokenType } from '@cardstack/types';
import { sortedByTokenBalanceAmount } from '@cardstack/utils';

const isLastItem = (items: TokenType[], index: number): boolean =>
  items.length - 1 === index;

interface MerchantTokensListProps {
  title: string;
  tokens: TokenType[];
  emptyText: string;
  onPress: () => void;
}

export const MerchantTokensList = ({
  title,
  onPress,
  tokens,
  emptyText,
}: MerchantTokensListProps) => {
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

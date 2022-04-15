import React from 'react';

import {
  CardPressable,
  Container,
  SafeHeader,
  TokenBalance,
} from '@cardstack/components';
import { DepotType } from '@cardstack/types';

import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

import { HorizontalDivider } from '../HorizontalDivider';
import { MoreItemsFooter } from '../MoreItemsFooter';

interface DepotProps extends Omit<DepotType, 'type'> {
  networkName: string;
}

/**
 * A inventory card component
 */
export const Depot = (depot: DepotProps) => {
  const { navigate } = useNavigation();

  const onPress = () => navigate(Routes.DEPOT_SCREEN, { depot });

  return (
    <Container width="100%" paddingHorizontal={4} marginBottom={4}>
      <CardPressable
        backgroundColor="white"
        borderRadius={10}
        overflow="hidden"
        borderColor="buttonPrimaryBorder"
        width="100%"
        testID="inventory-card"
        onPress={onPress}
      >
        <SafeHeader {...depot} onPress={onPress} />
        <Bottom {...depot} />
      </CardPressable>
    </Container>
  );
};

const Bottom = ({ tokens }: DepotProps) => {
  const firstThreeTokens = tokens.slice(0, 3);

  return (
    <Container paddingHorizontal={6} paddingVertical={4}>
      {firstThreeTokens.map((item, index) => (
        <Container key={`token-balance-${index}`}>
          <TokenBalance
            address={item.tokenAddress}
            tokenSymbol={item.token.symbol}
            tokenBalance={item.balance.display}
            nativeBalance={item.native.balance.display}
            paddingVertical={1}
          />
          {index !== firstThreeTokens.length - 1 ? <HorizontalDivider /> : null}
        </Container>
      ))}
      <MoreItemsFooter tokens={tokens} showCount={3} />
    </Container>
  );
};

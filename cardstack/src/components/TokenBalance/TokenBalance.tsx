import { ResponsiveValue } from '@shopify/restyle';
import React from 'react';
import { Theme } from '@cardstack/theme';
import {
  Container,
  ContainerProps,
  Text,
  Touchable,
  CoinIcon,
} from '@cardstack/components';

export interface TokenBalanceProps extends ContainerProps {
  onPress?: () => void;
  Icon?: JSX.Element;
  address?: string;
  tokenSymbol: string;
  tokenBalance?: string;
  tokenBalanceFontSize?: ResponsiveValue<keyof Theme['fontSizes'], Theme>;
  nativeBalance: string;
  includeBorder?: boolean;
  isLastItemIfList?: boolean;
  size?: number;
}

const borderStyle = {
  borderColor: 'borderGray',
  borderRadius: 10,
  borderWidth: 1,
  padding: 4,
  marginVertical: 1,
};

export const TokenBalance = (props: TokenBalanceProps) => {
  const {
    address,
    tokenSymbol,
    tokenBalance,
    tokenBalanceFontSize,
    nativeBalance,
    onPress,
    Icon,
    includeBorder,
    isLastItemIfList = true,
    size = 40,
    ...containerProps
  } = props;

  const borderProps = includeBorder ? borderStyle : {};
  const Wrapper = onPress ? Touchable : Container;

  return (
    <Wrapper onPress={onPress} {...borderProps} {...containerProps}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={isLastItemIfList ? 0 : 4}
      >
        <Container>
          <Container flexDirection="row" alignItems="center">
            {Icon ? (
              Icon
            ) : (
              <CoinIcon address={address} symbol={tokenSymbol} size={size} />
            )}
            <Container flexDirection="column" marginLeft={3}>
              <Text weight="extraBold" size={tokenBalanceFontSize || 'body'}>
                {tokenBalance}
              </Text>
              <Text variant="subText">{nativeBalance}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Wrapper>
  );
};

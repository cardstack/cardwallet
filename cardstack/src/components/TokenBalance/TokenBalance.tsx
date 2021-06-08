import React from 'react';
import {
  Container,
  ContainerProps,
  Text,
  Touchable,
  CoinIcon,
} from '@cardstack/components';

interface TokenBalanceProps extends ContainerProps {
  onPress?: () => void;
  Icon?: JSX.Element;
  address?: string;
  tokenSymbol: string;
  tokenBalance: string;
  nativeBalance: string;
  includeBorder?: boolean;
}

const borderStyle = {
  borderColor: 'buttonPrimaryBorder',
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
    nativeBalance,
    onPress,
    Icon,
    includeBorder,
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
      >
        <Container>
          <Container flexDirection="row">
            {Icon ? Icon : <CoinIcon address={address} symbol={tokenSymbol} />}
            <Container flexDirection="column" marginLeft={3}>
              <Text weight="extraBold">{tokenBalance}</Text>
              <Text variant="subText">{nativeBalance}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Wrapper>
  );
};

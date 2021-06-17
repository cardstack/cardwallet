import React from 'react';
import {
  Container,
  Icon,
  NetworkBadge,
  Text,
  Touchable,
} from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';

interface SafeHeaderProps {
  address: string;
  rightText?: string;
  onPress?: () => void;
  small?: boolean;
}

export const SafeHeader = (props: SafeHeaderProps) => {
  const { address, onPress, rightText, small } = props;

  return (
    <Container width="100%">
      <Container
        height={small ? 40 : 55}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="black"
        paddingHorizontal={5}
      >
        <Container flexDirection="row" alignItems="center">
          <NetworkBadge marginRight={2} />
          <Text
            fontFamily="RobotoMono-Regular"
            color="white"
            size={small ? 'xs' : 'body'}
          >
            {getAddressPreview(address)}
          </Text>
        </Container>
        <Touchable flexDirection="row" alignItems="center" onPress={onPress}>
          <Text
            color="white"
            weight="extraBold"
            size={small ? 'xs' : 'small'}
            marginRight={rightText ? 0 : 1}
          >
            {rightText || 'View'}
          </Text>
          {!rightText && (
            <Icon name="chevron-right" color="white" iconSize="medium" />
          )}
        </Touchable>
      </Container>
    </Container>
  );
};

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
  onPress: () => void;
}

export const SafeHeader = (props: SafeHeaderProps) => {
  const { address, onPress } = props;

  return (
    <Container width="100%">
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="black"
        paddingVertical={4}
        paddingHorizontal={5}
      >
        <Container flexDirection="row" alignItems="center">
          <NetworkBadge marginRight={2} />
          <Text fontFamily="RobotoMono-Regular" color="white">
            {getAddressPreview(address)}
          </Text>
        </Container>
        <Touchable flexDirection="row" alignItems="center" onPress={onPress}>
          <Text color="white" weight="extraBold" size="small" marginRight={1}>
            View
          </Text>
          <Icon name="chevron-right" color="white" iconSize="medium" />
        </Touchable>
      </Container>
    </Container>
  );
};

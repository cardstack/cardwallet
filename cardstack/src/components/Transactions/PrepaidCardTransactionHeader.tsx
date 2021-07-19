import React from 'react';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Container, NetworkBadge, Text } from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';

export const PrepaidCardTransactionHeader = ({
  address,
}: {
  address: string;
}) => (
  <Container
    height={40}
    flexDirection="row"
    paddingHorizontal={5}
    justifyContent="space-between"
    width="100%"
    alignItems="center"
  >
    <SVG />
    <Container flexDirection="row" alignItems="center">
      <NetworkBadge marginRight={2} />
      <Text variant="shadowRoboto" size="xs">
        {getAddressPreview(address)}
      </Text>
    </Container>
    <Text weight="extraBold" size="small">
      PREPAID CARD
    </Text>
  </Container>
);

const SVG = () => {
  return (
    <Svg height="40" width="115%" style={{ position: 'absolute' }}>
      <Defs>
        <LinearGradient
          id="grad"
          x1={0.168}
          x2={1.072}
          y2={1.05}
          gradientUnits="objectBoundingBox"
        >
          <Stop offset={0} stopColor="#00ebe5" />
          <Stop offset={1} stopColor="#c3fc33" />
        </LinearGradient>
      </Defs>
      <Rect id="Gradient" width="115%" height="40" fill="url(#grad)" />
    </Svg>
  );
};

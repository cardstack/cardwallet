import React from 'react';
import { CustomizableBackground } from '../PrepaidCard/CustomizableBackground';
import { Container, NetworkBadge, Text } from '@cardstack/components';
import { PrepaidCardCustomization } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { ColorTypes } from '@cardstack/theme';

export const PrepaidCardTransactionHeader = ({
  address,
  cardCustomization,
}: {
  address: string;
  cardCustomization?: PrepaidCardCustomization;
}) => (
  <Container
    height={40}
    flexDirection="row"
    paddingHorizontal={5}
    justifyContent="space-between"
    width="100%"
    alignItems="center"
  >
    <CustomizableBackground
      cardCustomization={cardCustomization}
      address={address}
      small
    />
    <Container flexDirection="row" alignItems="center">
      <NetworkBadge marginRight={2} />
      <Text
        size="xs"
        variant="overGradient"
        fontFamily="RobotoMono-Regular"
        color={cardCustomization?.textColor as ColorTypes}
        textShadowColor={cardCustomization?.patternColor as ColorTypes}
      >
        {getAddressPreview(address)}
      </Text>
    </Container>
    <Text
      weight="extraBold"
      size="small"
      color={cardCustomization?.textColor as ColorTypes}
    >
      PREPAID CARD
    </Text>
  </Container>
);

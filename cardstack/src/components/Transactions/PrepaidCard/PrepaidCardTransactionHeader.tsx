import React from 'react';
import { CustomizableBackground } from '../../PrepaidCard/components/CustomizableBackground';
import { Container, NetworkBadge, Text } from '@cardstack/components';
import { PrepaidCardCustomization } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { ColorTypes } from '@cardstack/theme';

export const PrepaidCardTransactionHeader = ({
  address,
  cardCustomization,
  prepaidInlineTransaction,
  merchantName,
}: {
  address: string;
  cardCustomization?: PrepaidCardCustomization;
  prepaidInlineTransaction?: boolean;
  merchantName?: string;
}) =>
  prepaidInlineTransaction ? (
    <Container height={32} flexDirection="row" paddingHorizontal={5}>
      <Text size="xs" color="blueText" lineHeight={32}>
        {`To `}
      </Text>
      <Text weight="bold" size="xs" color="blueText" lineHeight={32}>
        {merchantName || getAddressPreview(address)}
      </Text>
    </Container>
  ) : (
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
        variant="small"
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
        RECEIPT
      </Text>
    </Container>
  );

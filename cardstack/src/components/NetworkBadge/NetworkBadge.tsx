import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';

import { Container, Text } from '@cardstack/components';
import { shortNetworkName } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

import { ContainerProps } from '../Container';

export const NetworkBadge = (
  props: ContainerProps & { text?: string; network?: string }
) => {
  const { network: currentNetwork } = useAccountSettings();

  const displayNetworkName = shortNetworkName(
    getConstantByNetwork('name', props.network || currentNetwork)
  ).toUpperCase();

  return (
    <Container flexDirection="row" {...props}>
      <Container
        backgroundColor="backgroundLightGray"
        paddingHorizontal={2}
        paddingVertical={1}
        borderRadius={50}
      >
        <Text color="blueDarkest" fontSize={9} weight="bold">
          {props.text || `ON ${displayNetworkName}`}
        </Text>
      </Container>
    </Container>
  );
};

import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';

import { Container, Text } from '@cardstack/components';
import { shortNetworkName } from '@cardstack/utils';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';

import { ContainerProps } from '../Container';

export const NetworkBadge = (props: ContainerProps & { text?: string }) => {
  const networkName = useRainbowSelector(state => state.settings.network);

  const displayNetworkName = shortNetworkName(
    getConstantByNetwork('name', networkName)
  ).toUpperCase();

  return (
    <Container flexDirection="row" {...props}>
      <Container
        backgroundColor="backgroundLightGray"
        paddingHorizontal={2}
        style={{ paddingVertical: 1 }}
        borderRadius={50}
      >
        <Text color="blueDarkest" fontSize={9} weight="bold">
          {props.text || `ON ${displayNetworkName}`}
        </Text>
      </Container>
    </Container>
  );
};

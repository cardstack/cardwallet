import React from 'react';

import { Container, Text } from '@cardstack/components';

import { networkInfo } from '@rainbow-me/helpers/networkInfo';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

import { ContainerProps } from '../Container';

export const NetworkBadge = (props: ContainerProps & { text?: string }) => {
  const networkName = useRainbowSelector(state => state.settings.network);

  return (
    <Container flexDirection="row" {...props}>
      <Container
        backgroundColor="backgroundLightGray"
        paddingHorizontal={2}
        style={{ paddingVertical: 1 }}
        borderRadius={50}
      >
        <Text color="blueDarkest" fontSize={9} weight="bold">
          {props.text ||
            `ON ${networkInfo[networkName].shortName.toUpperCase()}`}
        </Text>
      </Container>
    </Container>
  );
};

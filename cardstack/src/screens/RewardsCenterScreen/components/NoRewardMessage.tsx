import React from 'react';
import { strings } from '../strings';
import { Container, ContainerProps, Text } from '@cardstack/components';

export const NoRewardMessage = (props: ContainerProps) => (
  <Container width="100%" {...props}>
    <Container
      padding={8}
      alignItems="center"
      borderColor="borderLightColor"
      borderWidth={1}
      borderRadius={10}
    >
      <Text weight="bold" size="body" paddingLeft={2} textAlign="center">
        {strings.register.noReward}
      </Text>
    </Container>
  </Container>
);

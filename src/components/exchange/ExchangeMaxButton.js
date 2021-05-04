import React from 'react';
import { ButtonPressAnimation } from '../animations';
import { Container, Icon, Text } from '@cardstack/components';

export default function ExchangeMaxButton({ disabled, onPress, testID }) {
  return (
    <ButtonPressAnimation disabled={disabled} onPress={onPress} testID={testID}>
      <Container marginRight={1}>
        <Container
          alignItems="center"
          alignSelf="center"
          flexDirection="row"
          height={32}
          paddingHorizontal={4}
          paddingVertical={0}
        >
          <Icon color="black" iconSize="small" name="arrow-up" />
          <Text weight="bold">Max</Text>
        </Container>
      </Container>
    </ButtonPressAnimation>
  );
}

import React from 'react';
import { ButtonPressAnimation } from '../animations';
import { Container, Icon, Text } from '@cardstack/components';

export default function ExchangeMaxButton({ disabled, onPress, testID }) {
  return (
    <ButtonPressAnimation disabled={disabled} onPress={onPress} testID={testID}>
      <Container marginRight={1}>
        <Container
          alignItems="center"
          flexDirection="row"
          height={32}
          paddingHorizontal={4}
        >
          <Icon color="black" iconSize="small" name="arrow-max" />
          <Text weight="bold">Max</Text>
        </Container>
      </Container>
    </ButtonPressAnimation>
  );
}

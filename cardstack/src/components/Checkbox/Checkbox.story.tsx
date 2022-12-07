import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { Container } from '../Container';

import { Checkbox } from './Checkbox';

storiesOf('Checkbox', module)
  .add('Default', () => (
    <Container backgroundColor="white" width="100%" padding={4}>
      <Checkbox
        label="Label"
        isSelected={true}
        onPress={() => Alert.alert('pressed')}
      />
    </Container>
  ))
  .add('Disabled', () => (
    <Container backgroundColor="white" width="100%" padding={4}>
      <Checkbox
        label="Disabled"
        isSelected
        onPress={() => Alert.alert('pressed')}
      />
    </Container>
  ));

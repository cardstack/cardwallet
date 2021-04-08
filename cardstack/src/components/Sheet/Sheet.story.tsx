import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Text } from '../Text';
import { Sheet } from './Sheet';

storiesOf('Sheet', module).add('Default', () => (
  <Sheet borderRadius={20}>
    <Text>Sheet</Text>
  </Sheet>
));

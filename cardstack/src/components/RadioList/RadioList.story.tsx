import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { Container } from '../Container';
import { RadioList } from './RadioList';

const DATA = [
  {
    title: 'Section 1',
    data: [
      {
        disabled: false,
        key: 0,
        label: 'item 1',
        value: '1',
        default: true,
        selected: true,
      },
      {
        disabled: false,
        key: 1,
        label: 'item 2',
        value: '2',
        default: false,
        selected: false,
      },
    ],
  },
  {
    title: 'Section 2',
    data: [
      {
        disabled: false,
        key: 2,
        label: 'item 3',
        value: '3',
        default: false,
        selected: false,
      },
    ],
  },
];

storiesOf('Radio List', module).add('Default', () => (
  <Container backgroundColor="white" width="100%" padding={4}>
    <RadioList
      items={DATA}
      onChange={(value: string) => Alert.alert('pressed', value)}
    />
  </Container>
));

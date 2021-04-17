/* eslint-disable @typescript-eslint/camelcase */
import { storiesOf } from '@storybook/react-native';
import { current } from 'immer';
import lodash from 'lodash';
import React from 'react';
import { Alert } from 'react-native';

import { Container } from '../Container';
import { RadioItemProps, RadioList } from './RadioList';

const networks = [
  {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    layer: 1,
    name: 'xDai',
    value: 'mainnet',
  },

  {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    layer: 2,
    name: 'Sokol',
    value: 'sokol',
  },
  {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    layer: 2,
    name: 'Sokol',
    value: 'sokol',
  },
  {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    layer: 2,
    name: 'Sokol',
    value: 'sokol',
  },
];

const groupByLayer = networks
  .reduce((result: any, curr: any, currentIndex: number) => {
    result[curr.layer] =
      {
        title: curr.layer,
        data: [
          ...(result[curr.layer]?.data || []),
          {
            disabled: curr.disabled,
            key: currentIndex,
            label: curr.name,
            value: curr.name,
          },
        ],
      } || {};

    return result;
  }, [])
  .flat();

storiesOf('Radio List', module).add('Default', () => (
  <Container backgroundColor="white" width="100%" padding={4}>
    <RadioList
      items={groupByLayer}
      onChange={(value: string) => Alert.alert('pressed', value)}
      defaultValue={0}
    />
  </Container>
));

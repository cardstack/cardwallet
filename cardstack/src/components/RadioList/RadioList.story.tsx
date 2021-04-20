/* eslint-disable @typescript-eslint/camelcase */
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { Container } from '../Container';
import { RadioList } from './RadioList';

const networks = [
  {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    layer: 2,
    name: 'xDai Chain',
    value: 'mainnet',
    default: true,
    selected: false,
  },

  {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    layer: 1,
    name: 'Sokol',
    value: 'sokol',
    default: false,
    selected: true,
  },
  {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    layer: 1,
    name: 'Sokol',
    value: 'sokol',
    default: false,
    selected: false,
  },
  {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    layer: 1,
    name: 'Sokol',
    value: 'sokol',
    default: false,
    selected: false,
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
            default: curr.default,
            selected: curr.selected,
          },
        ],
      } || {};

    return result;
  }, [])
  .flat()
  .sort((a, b) => a.layer < b.layer);

storiesOf('Radio List', module).add('Default', () => (
  <Container backgroundColor="white" width="100%" padding={4}>
    <RadioList
      items={groupByLayer}
      onChange={(value: string) => Alert.alert('pressed', value)}
    />
  </Container>
));

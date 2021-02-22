import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { Button } from './Button';
import { buttonVariants } from './buttonVariants';

const variants = Object.keys(buttonVariants) as (keyof typeof buttonVariants)[];

storiesOf('Button', module).add('Default', () => (
  <View>
    {variants.map(variant => (
      <Button
        key={variant}
        margin="2"
        variant={variant !== 'defaults' ? variant : undefined}
      >
        Hello World
      </Button>
    ))}
  </View>
));

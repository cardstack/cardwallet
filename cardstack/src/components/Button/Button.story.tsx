import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { ButtonVariants, buttonVariants } from '../../theme/buttonVariants';
import { Button } from './Button';

const variants = Object.keys(buttonVariants) as ButtonVariants[];

storiesOf('Button', module).add('Default', () => (
  <View>
    {variants.map(variant => (
      <Button
        key={variant}
        margin={2}
        variant={variant !== 'defaults' ? variant : undefined}
      >
        Hello World
      </Button>
    ))}
  </View>
));

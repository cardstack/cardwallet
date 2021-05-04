import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Container } from '../Container';
import { Button } from './Button';

storiesOf('Button', module).add('Default', () => (
  <Container
    height="100%"
    justifyContent="center"
    width="100%"
    alignItems="center"
  >
    <Container
      alignItems="center"
      justifyContent="space-evenly"
      height="80%"
      width="100%"
    >
      <Button>Default</Button>
      <Button loading>Default</Button>
      <Button
        iconProps={{
          iconSize: 'medium',
          marginRight: 2,
          name: 'pin',
        }}
      >
        With Icon
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="blue">Blue</Button>
      <Button variant="dark">Dark</Button>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
      >
        <Button variant="small">Small 1</Button>
        <Button variant="small">Small 2</Button>
      </Container>
      <Button variant="extraSmall">XSmall</Button>
      <Button variant="extraSmallDark">XSmallDark</Button>
    </Container>
  </Container>
));

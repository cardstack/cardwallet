import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Container } from '../Container';
import { OptionItem } from './OptionItem';

storiesOf('Option Item', module).add('Default', () => (
  <Container backgroundColor="white" width="100%" padding={4}>
    <OptionItem
      iconProps={{ name: 'download', size: 22 }}
      marginTop={2}
      onPress={() => console.log('Pressed!')}
      textProps={{
        color: 'black',
        fontSize: 14,
      }}
      title="Add an existing account"
    />
  </Container>
));

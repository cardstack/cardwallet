import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Alert } from 'react-native';
import { Container } from '../Container';
import { ListItem } from './ListItem';
import { padding } from '@rainbow-me/styles';

storiesOf('List Item', module).add('Default', () => (
  <Container backgroundColor="white" width="100%">
    <ListItem
      iconProps={{ name: 'download', size: 22 }}
      onPress={() => Alert.alert('Pressed!')}
      textProps={{
        color: 'black',
        fontSize: 14,
      }}
      title="Add an existing account"
      subText="Connected"
      avatarSrcImage="https://freaklab.org/wp-content/uploads/2017/08/portrait-placeholder-grey.gif"
    />
    <ListItem
      iconProps={{ name: 'download', size: 22 }}
      onPress={() => Alert.alert('Pressed!')}
      textProps={{
        color: 'black',
        fontSize: 14,
      }}
      title="Add an existing account"
      subText="Connected"
    />
  </Container>
));

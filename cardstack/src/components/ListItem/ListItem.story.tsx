import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Alert } from 'react-native';
import { Container } from '../Container';
import { ListItem } from './ListItem';

const actionOptions = ['1', '2'];

storiesOf('List Item', module).add('Default', () => (
  <Container backgroundColor="white" width="100%">
    <ListItem
      title="Add an existing account"
      actionSheetProps={{
        options: actionOptions,
        title: 'hello',
        onPress: () => Alert.alert('hello'),
      }}
      avatarProps={{
        source:
          'https://freaklab.org/wp-content/uploads/2017/08/portrait-placeholder-grey.gif',
      }}
      subText="Connected"
    />
    <ListItem
      actionSheetProps={{
        options: actionOptions,
        title: 'hello again',
        onPress: () => Alert.alert('hello'),
      }}
      title="Add an existing account"
      subText="Connected"
    />
    <ListItem
      actionSheetProps={{
        options: actionOptions,
        title: 'hello again',
        onPress: () => Alert.alert('hello'),
      }}
      avatarProps={{
        textValue: 'VT',
      }}
      title="Add an existing account"
      subText="Connected"
    />
  </Container>
));

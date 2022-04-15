import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Container } from '../Container';
import { Text } from '../Text';

import { Icon, IconName } from './Icon';
import { customIcons } from './custom-icons';

storiesOf('Icon', module).add('Custom Icons', () => (
  <Container
    height="100%"
    justifyContent="center"
    width="100%"
    flexWrap="wrap"
    flexDirection="row"
  >
    {Object.keys(customIcons).map(iconName => (
      <Container margin={4} alignItems="center">
        <Icon name={iconName as IconName} />
        <Text variant="smallGrey" marginTop={1}>
          {iconName}
        </Text>
      </Container>
    ))}
  </Container>
));

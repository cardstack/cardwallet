import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Container } from '../Container';
import { Text } from '../Text';
import { customIcons } from './custom-icons';
import { Icon } from './Icon';

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
        {/* @ts-ignore */}
        <Icon name={iconName} />
        <Text variant="smallGrey" marginTop={1}>
          {iconName}
        </Text>
      </Container>
    ))}
  </Container>
));

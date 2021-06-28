import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { QRCode } from './QRCode';
import { Container } from '@cardstack/components';

storiesOf('QRCode', module).add('Default', () => {
  return (
    <Container
      alignItems="center"
      justifyContent="center"
      flex={1}
      backgroundColor="transparent"
    >
      <QRCode value="0x00000000" size={200} logoSize={50} logoMargin={10} />
    </Container>
  );
});

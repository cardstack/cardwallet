import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { text } from '@storybook/addon-knobs';
import { SystemNotification } from './SystemNotification';
import { Container, Text } from '@cardstack/components';

storiesOf('System Notification', module).add('Default', () => {
  const closedText = text(
    'Closed Text',
    'Prepaid cards are denominated in SPEND'
  );

  const openedHeaderText = text('Opened Header Text', '§1 SPEND = $0.01 USD');

  const openedBodyText = text(
    'Opened Body Text',
    'The Spendable Balance may fluctuate slightly based on the exchange rate of the underlying token (USD_DAI)'
  );

  return (
    <SystemNotification
      openedComponent={
        <Container>
          <Text fontWeight="700">{openedHeaderText}</Text>
          <Text fontSize={13}>{openedBodyText}</Text>
        </Container>
      }
    >
      <Text fontSize={13}>{closedText}</Text>
    </SystemNotification>
  );
});

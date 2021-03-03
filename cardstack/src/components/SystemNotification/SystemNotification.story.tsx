import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { SystemNotification } from './SystemNotification';
import { Container } from '@cardstack/components';

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

  const props = {
    closedText,
    openedHeaderText,
    openedBodyText,
  };

  return (
    <Container position="absolute" top={200} width="100%" alignItems="center">
      <SystemNotification {...props} />
      <SystemNotification type="alert" {...props} />
      <SystemNotification type="error" {...props} />
    </Container>
  );
});

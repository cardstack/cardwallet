import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { CollapsibleBanner } from './CollapsibleBanner';
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

  const closeForeverButtonText = text("Don't show again");

  const props = {
    closedText,
    openedHeaderText,
    openedBodyText,
    closeForeverButtonText,
  };

  return (
    <Container position="absolute" top={200} width="100%" alignItems="center">
      <CollapsibleBanner {...props} />
      <CollapsibleBanner type="alert" {...props} />
      <CollapsibleBanner type="error" {...props} />
    </Container>
  );
});

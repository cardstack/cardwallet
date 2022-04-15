import React, { memo, useMemo } from 'react';

import { Text } from '@cardstack/components';

import { CollapsibleBanner } from './CollapsibleBanner';
import { useBusinessAccountBanner } from './useBusinessAccountBanner';

const openedHeaderText = 'To Create a Business Account';
const closeForeverButtonText = "DON'T SHOW AGAIN";

export const BusinessAccountBanner = memo(() => {
  const {
    showBusinessAccountBanner,
    closeBannerForever,
  } = useBusinessAccountBanner();

  const closedText = useMemo(
    () => (
      <Text weight="bold">
        Want to request a payment?{`\n`}Click here to learn more
      </Text>
    ),
    []
  );

  const openedBodyText = useMemo(
    () => (
      <Text>
        Go to <Text weight="bold">app.cardstack.com/cardpay</Text> on a computer
        and click the <Text weight="bold">Business</Text> tab. Follow the
        instructions to create a business account.
      </Text>
    ),
    []
  );

  const notificationProps = useMemo(
    () => ({
      closedText,
      openedHeaderText,
      openedBodyText,
      closeForeverButtonText,
    }),
    [closedText, openedBodyText]
  );

  return showBusinessAccountBanner ? (
    <CollapsibleBanner
      type="info"
      closeForeverPress={closeBannerForever}
      {...notificationProps}
    />
  ) : null;
});

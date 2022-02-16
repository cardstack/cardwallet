import React, { memo, useMemo } from 'react';
import { CollapsibleBanner } from './CollapsibleBanner';
import { useBusinessAccountBanner } from './useBusinessAccountBanner';
import { Text } from '@cardstack/components';

const openedHeaderText = 'To Create a Business Account';
const closeForeverButtonText = "DON'T SHOW AGAIN";

export const BusinessAccountBanner = memo(() => {
  const {
    showBusinessAccountBanner,
    closeBannerForever,
  } = useBusinessAccountBanner();

  const closedText = useMemo(
    () => (
      <Text fontWeight="bold">
        Want to request a payment?{`\n`}Click here to learn more
      </Text>
    ),
    []
  );

  const openedBodyText = useMemo(
    () => (
      <Text>
        Go to <Text fontWeight="bold">app.cardstack.com/cardpay</Text> on a
        computer and click the <Text fontWeight="bold">Business</Text> tab.
        Follow the instructions to create a business account.
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

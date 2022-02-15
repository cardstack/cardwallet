import React, { memo } from 'react';
import { CollapsibleBanner } from './CollapsibleBanner';
import { useBusinessAccountBanner } from './useBusinessAccountBanner';
import { Text } from '@cardstack/components';

export const BusinessAccountBanner = memo(() => {
  const {
    showBusinessAccountBanner,
    closeBannerForever,
  } = useBusinessAccountBanner();

  const closedText = (
    <Text weight="bold">
      Want to request a payment?{`\n`}Click here to learn more
    </Text>
  );

  const openedHeaderText = 'To Create a Business Account';

  const openedBodyText = (
    <Text>
      Go to <Text weight="bold">app.cardstack.com/cardpay</Text> on a computer
      and click the <Text weight="bold">Business</Text> tab. Follow the
      instructions to create a business account.
    </Text>
  );

  const closeForeverButtonText = "DON'T SHOW AGAIN";

  const notificationProps = {
    closedText,
    openedHeaderText,
    openedBodyText,
    closeForeverButtonText,
  };

  return showBusinessAccountBanner ? (
    <CollapsibleBanner
      type="info"
      closeForeverPress={() => closeBannerForever()}
      {...notificationProps}
    />
  ) : null;
});

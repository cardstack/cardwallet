import React, { memo } from 'react';
import { CenteredContainer } from '@cardstack/components';
import ActivityIndicator from '@rainbow-me/components/ActivityIndicator';

const PayMerchantUniversalLink = () => {
  return (
    <CenteredContainer flex={1}>
      <ActivityIndicator color="white" />
    </CenteredContainer>
  );
};

export default memo(PayMerchantUniversalLink);

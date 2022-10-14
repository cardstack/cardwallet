import React, { memo } from 'react';

import { OverlayContainer, Text } from '@cardstack/components';

const ToastOverlay = (message: string) => (
  <OverlayContainer>
    <Text color="blueText" size="body" textAlign="center">
      {message}
    </Text>
  </OverlayContainer>
);

export default memo(ToastOverlay);

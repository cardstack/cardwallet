import React, { memo } from 'react';

import { OverlayContainer, Text } from '@cardstack/components';

import { MessageOverlayParams } from './useMessageOverlay';

const MessageOverlay = ({ message }: MessageOverlayParams) => (
  <OverlayContainer>
    <Text color="blueText" size="body" textAlign="center">
      {message}
    </Text>
  </OverlayContainer>
);

export default memo(MessageOverlay);

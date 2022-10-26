import { useRoute } from '@react-navigation/native';
import React from 'react';

import { MessageOverlay, MessageOverlayParams } from '@cardstack/components';

import { useBlockBackButton } from '@rainbow-me/hooks/useBlockBackButton';

const MessageOverlayScreen = () => {
  const { params } = useRoute() as { params: MessageOverlayParams };

  useBlockBackButton();

  return <MessageOverlay {...params} />;
};

export default MessageOverlayScreen;

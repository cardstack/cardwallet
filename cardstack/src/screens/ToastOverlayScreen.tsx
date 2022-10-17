import { useRoute } from '@react-navigation/native';
import React from 'react';

import { ToastOverlay, MessageOverlayParams } from '@cardstack/components';

import { useBlockBackButton } from '@rainbow-me/hooks/useBlockBackButton';

const ToastOverlayScreen = () => {
  const { params } = useRoute() as { params: MessageOverlayParams };

  useBlockBackButton();

  return <ToastOverlay {...params} />;
};

export default ToastOverlayScreen;

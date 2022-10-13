import { useRoute } from '@react-navigation/native';
import React from 'react';

import { ToastOverlay, ToastOverlayParams } from '@cardstack/components';

import { useBlockBackButton } from '@rainbow-me/hooks/useBlockBackButton';

const ToastOverlayScreen = () => {
  const { params } = useRoute() as { params: ToastOverlayParams };

  useBlockBackButton();

  return <ToastOverlay {...params} />;
};

export default ToastOverlayScreen;

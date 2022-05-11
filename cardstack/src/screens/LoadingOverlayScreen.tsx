import { useRoute } from '@react-navigation/native';
import React from 'react';

import { LoadingOverlay } from '@cardstack/components';

import { useBlockBackButton } from '@rainbow-me/hooks/useBlockBackButton';

const LoadingOverlayScreen = () => {
  const {
    params: { title, subTitle },
  } = useRoute() as { params: { title: string; subTitle: string } };

  useBlockBackButton();

  return <LoadingOverlay title={title} subTitle={subTitle} />;
};

export default LoadingOverlayScreen;

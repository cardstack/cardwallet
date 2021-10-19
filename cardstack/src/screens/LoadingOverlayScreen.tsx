import React from 'react';
import { useRoute } from '@react-navigation/core';
import { LoadingOverlay } from '@cardstack/components';

const LoadingOverlayScreen = () => {
  const {
    params: { title, subTitle },
  } = useRoute() as { params: { title: string; subTitle: string } };

  return <LoadingOverlay title={title} subTitle={subTitle} />;
};

export default LoadingOverlayScreen;

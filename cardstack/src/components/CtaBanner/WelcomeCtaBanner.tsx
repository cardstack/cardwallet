import { useNavigation } from '@react-navigation/core';
import React, { useCallback } from 'react';

import Routes from '@rainbow-me/navigation/routesNames';

import { strings } from './strings';

import { CtaBanner, useCtaBanner } from '.';

const WELCOME_BANNER_KEY = 'WELCOME_BANNER_KEY';

export const WelcomeCtaBanner = () => {
  const { showBanner, dismissBanner } = useCtaBanner(WELCOME_BANNER_KEY);
  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    navigate(Routes.REQUEST_PREPAID_CARD);
  }, [navigate]);

  if (!showBanner) return null;

  return (
    <CtaBanner
      title={strings.welcome.title}
      description={strings.welcome.description}
      ctaButtonTitle={strings.welcome.ctaButtonTitle}
      ctaButtonIconName="wallet"
      onPress={onPress}
      onDismissPressed={dismissBanner}
    />
  );
};

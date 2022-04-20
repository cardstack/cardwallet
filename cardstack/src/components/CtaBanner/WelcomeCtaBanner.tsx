import React from 'react';
import { Alert } from 'react-native';

import { strings } from './strings';

import { CtaBanner, useCtaBanner } from '.';

const WELCOME_BANNER_KEY = 'WELCOME_BANNER_KEY';

export const WelcomeCtaBanner = () => {
  const { showBanner, dismissBanner } = useCtaBanner(WELCOME_BANNER_KEY);
  if (!showBanner) return null;

  return (
    <CtaBanner
      title={strings.welcome.title}
      description={strings.welcome.description}
      ctaButtonTitle={strings.welcome.ctaButtonTitle}
      ctaButtonIconName="wallet"
      onCtaPressed={() => Alert.alert('Welcome')}
      onDismissPressed={() => Alert.alert('Should dismiss')}
    />
  );
};

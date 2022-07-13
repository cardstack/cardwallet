import React from 'react';

import { strings } from './strings';
import { useWelcomeCtaBanner } from './useWelcomeCtaBanner';

import { CtaBanner } from '.';

export const WelcomeCtaBanner = () => {
  const { showBanner, onDismissBannerPress, onPress } = useWelcomeCtaBanner();

  if (!showBanner) return null;

  return (
    <CtaBanner
      title={strings.welcome.title}
      description={strings.welcome.description}
      ctaButtonTitle={strings.welcome.ctaButtonTitle}
      ctaButtonIconName="wallet"
      onPress={onPress}
      onDismissPressed={onDismissBannerPress}
    />
  );
};

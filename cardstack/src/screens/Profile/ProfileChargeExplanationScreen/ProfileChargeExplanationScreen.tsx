import { useRoute } from '@react-navigation/native';
import React, { memo } from 'react';

import {
  Container,
  IconProps,
  OnboardingPage,
  Text,
} from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

import { strings } from './strings';

const leftIconProps: IconProps = { name: 'x' };

interface NavParams {
  localizedValue: string;
}

const ProfileChargeExplanationScreen = () => {
  const {
    params: { localizedValue },
  } = useRoute<RouteType<NavParams>>();

  return (
    <OnboardingPage flow="profile-creation" leftIconProps={leftIconProps}>
      <Container flex={1} backgroundColor="backgroundDarkPurple">
        <Text color="white" variant="pageHeader" paddingBottom={5}>
          {strings.title}
        </Text>
        <Text color="grayText" letterSpacing={0.4}>
          {strings.description(localizedValue)}
        </Text>
      </Container>
    </OnboardingPage>
  );
};

export default memo(ProfileChargeExplanationScreen);

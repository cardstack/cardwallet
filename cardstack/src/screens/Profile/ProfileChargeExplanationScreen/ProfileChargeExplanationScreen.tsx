import { useRoute } from '@react-navigation/native';
import React, { memo } from 'react';

import {
  Container,
  IconProps,
  InPageHeader,
  SafeAreaView,
  Text,
} from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

import { strings } from './strings';

const leftIconProps: IconProps = { name: 'x', left: -6 };

interface NavParams {
  localizedValue: string;
}

const ProfileChargeExplanationScreen = () => {
  const {
    params: { localizedValue },
  } = useRoute<RouteType<NavParams>>();

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={5}
      justifyContent="space-between"
    >
      <InPageHeader showSkipButton={false} leftIconProps={leftIconProps} />

      <Container flex={0.95}>
        <Text color="white" variant="pageHeader" paddingBottom={5}>
          {strings.title}
        </Text>
        <Text color="grayText" letterSpacing={0.4}>
          {strings.description(localizedValue)}
        </Text>
      </Container>
    </SafeAreaView>
  );
};

export default memo(ProfileChargeExplanationScreen);

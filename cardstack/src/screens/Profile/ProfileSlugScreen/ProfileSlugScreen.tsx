import React, { memo } from 'react';

import {
  Container,
  Text,
  SafeAreaView,
  NavigationStackHeader,
} from '@cardstack/components';
import SuffixedInput from '@cardstack/components/Input/SuffixedInput/SuffixedInput';
import { fontFamilyVariants } from '@cardstack/theme';

import { strings } from './strings';
import { useProfileSlugScreen } from './useProfileSlugScreen';

const layouts = {
  defaultPadding: 5,
};

const ProfileSlugScreen = () => {
  const { username, onUsernameChange } = useProfileSlugScreen();

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={layouts.defaultPadding}
    >
      <NavigationStackHeader
        canGoBack={true}
        backgroundColor="backgroundDarkPurple"
      />
      <Container flex={0.15} alignItems="flex-end" paddingVertical={2}>
        <Text fontSize={13} color="teal" fontWeight="bold">
          skip
        </Text>
      </Container>
      <Container flex={1}>
        <Text fontSize={24} color="white" {...fontFamilyVariants.light}>
          {strings.header}
        </Text>
        <SuffixedInput suffixText={strings.input.domainSuffix} />
        <Container width="80%">
          <Text fontSize={12} color="white">
            {strings.input.valid}
          </Text>
          <Text fontSize={12} color="grayText">
            {strings.input.description}
          </Text>
        </Container>
      </Container>
    </SafeAreaView>
  );
};

export default memo(ProfileSlugScreen);

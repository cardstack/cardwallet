import React, { memo } from 'react';
import { StatusBar } from 'react-native';

import { Container, Text, NavigationStackHeader } from '@cardstack/components';

import { strings } from './strings';
import { useProfileSlugScreen } from './useProfileSlugScreen';

const ProfileSlugScreen = () => {
  const { username, setUsername } = useProfileSlugScreen();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <StatusBar barStyle="light-content" />
      <NavigationStackHeader
        canGoBack={true}
        backgroundColor="backgroundDarkPurple"
      />
      <Text>{strings.title}</Text>
    </Container>
  );
};

export default memo(ProfileSlugScreen);

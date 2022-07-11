import React, { memo } from 'react';
import { StatusBar } from 'react-native';

import {
  Container,
  Text,
  NavigationStackHeader,
  Input,
} from '@cardstack/components';

import { strings } from './strings';
import { useProfileSlugScreen } from './useProfileSlugScreen';

const ProfileSlugScreen = () => {
  const { username, onUsernameChange } = useProfileSlugScreen();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <StatusBar barStyle="light-content" />
      <NavigationStackHeader
        canGoBack={true}
        backgroundColor="backgroundDarkPurple"
      />
      <Container padding={6}>
        <Text>{strings.title}</Text>
        <Input
          color="teal"
          fontSize={24}
          autoCapitalize="none"
          textContentType="username"
          multiline={true}
          // borderColor={errors?.businessId ? 'error' : 'buttonSecondaryBorder'}
          value={username}
          onChange={onUsernameChange}
          // ref={businessIdRef}
          returnKeyType="done"
          onContentSizeChange={e => console.log(e.nativeEvent)}
        />
      </Container>
    </Container>
  );
};

export default memo(ProfileSlugScreen);

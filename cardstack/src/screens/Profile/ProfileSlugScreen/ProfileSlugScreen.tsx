import React, { memo } from 'react';

import {
  Container,
  Text,
  SafeAreaView,
  Touchable,
  Icon,
  Button,
} from '@cardstack/components';
import SuffixedInput from '@cardstack/components/Input/SuffixedInput/SuffixedInput';
import { fontFamilyVariants } from '@cardstack/theme';

import UsernameValidFeedback from './components/UsernameValidFeedback';
import { strings } from './strings';
import { useProfileSlugScreen } from './useProfileSlugScreen';

const layouts = {
  defaultPadding: 5,
  titleTextSize: 24,
  smallTextSize: 12,
};

const ProfileSlugScreen = () => {
  const {
    username,
    onUsernameChange,
    invalidUsernameMessage,
    onGoBackPressed,
    onSkipPressed,
  } = useProfileSlugScreen();

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={layouts.defaultPadding}
    >
      <Container
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        flex={0.15}
      >
        <Touchable onPress={onGoBackPressed}>
          <Icon name="chevron-left" color="teal" size={30} />
        </Touchable>
        <Touchable onPress={onSkipPressed}>
          <Text fontSize={13} color="teal" fontFamily="OpenSans-Semibold">
            {strings.buttons.skip}
          </Text>
        </Touchable>
      </Container>
      <Container flex={1}>
        <Container width="90%" paddingBottom={4}>
          <Text
            fontSize={layouts.titleTextSize}
            color="white"
            {...fontFamilyVariants.light}
          >
            {strings.header}
          </Text>
        </Container>

        <Container paddingBottom={1}>
          <SuffixedInput
            value={username}
            onChangeText={onUsernameChange}
            suffixText={strings.input.domainSuffix}
          />
        </Container>
        <Container width="100%">
          <UsernameValidFeedback
            invalidUsernameMessage={invalidUsernameMessage}
          />
          <Text fontSize={layouts.smallTextSize} color="grayText">
            {strings.input.description}
          </Text>
        </Container>
      </Container>
      <Container flex={0.2}>
        <Button disabled={!!invalidUsernameMessage}>
          {strings.buttons.continue}
        </Button>
      </Container>
    </SafeAreaView>
  );
};

export default memo(ProfileSlugScreen);

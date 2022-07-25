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

import UsernameValidFeedback from './components/UsernameValidFeedback';
import { strings } from './strings';
import { useProfileSlugScreen } from './useProfileSlugScreen';

const ProfileSlugScreen = () => {
  const {
    username,
    onUsernameChange,
    invalidUsernameMessage,
    onGoBackPressed,
    onSkipPressed,
    onContinuePress,
  } = useProfileSlugScreen();

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={5}
    >
      <Container
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        flex={0.15}
      >
        <Touchable onPress={onGoBackPressed}>
          <Icon name="chevron-left" color="teal" size={30} left={-6} />
        </Touchable>
        <Touchable onPress={onSkipPressed}>
          <Text fontSize={13} color="teal" variant="semibold">
            {strings.buttons.skip}
          </Text>
        </Touchable>
      </Container>
      <Container flex={1}>
        <Container width="90%" paddingBottom={4}>
          <Text variant="pageHeader">{strings.header}</Text>
        </Container>

        <Container paddingBottom={1}>
          <SuffixedInput
            value={username}
            onChangeText={onUsernameChange}
            suffixText={strings.input.domainSuffix}
          />
        </Container>
        <Container width="100%">
          <UsernameValidFeedback invalidMessage={invalidUsernameMessage} />
          <Text variant="pageDescriptionSmall">
            {strings.input.description}
          </Text>
        </Container>
      </Container>
      <Container flex={0.2}>
        <Button onPress={onContinuePress} disabled={!!invalidUsernameMessage}>
          {strings.buttons.continue}
        </Button>
      </Container>
    </SafeAreaView>
  );
};

export default memo(ProfileSlugScreen);

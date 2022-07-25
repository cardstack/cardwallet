import React, { memo } from 'react';

import {
  Container,
  Text,
  SafeAreaView,
  Button,
  InPageHeader,
} from '@cardstack/components';
import SuffixedInput from '@cardstack/components/Input/SuffixedInput/SuffixedInput';

import UsernameValidFeedback from './components/UsernameValidFeedback';
import { strings } from './strings';
import { useProfileSlugScreen } from './useProfileSlugScreen';

const ProfileSlugScreen = () => {
  const {
    username,
    onUsernameChange,
    isUsernameValid,
    showMessage,
    message,
    onContinuePress,
  } = useProfileSlugScreen();

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={5}
      justifyContent="space-between"
    >
      <InPageHeader showSkipButton={false} />
      <Container flex={0.8}>
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
          <UsernameValidFeedback
            isValid={isUsernameValid}
            message={message}
            isVisible={showMessage}
          />
          <Text variant="pageDescriptionSmall">
            {strings.input.description}
          </Text>
        </Container>
      </Container>
      <Container flex={0.2}>
        <Button
          onPress={onContinuePress}
          disabled={!(isUsernameValid && showMessage)}
        >
          {strings.buttons.continue}
        </Button>
      </Container>
    </SafeAreaView>
  );
};

export default memo(ProfileSlugScreen);

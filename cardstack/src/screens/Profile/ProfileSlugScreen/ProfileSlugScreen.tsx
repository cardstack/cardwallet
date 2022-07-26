import React, { memo } from 'react';

import {
  Container,
  Text,
  SafeAreaView,
  Button,
  InPageHeader,
} from '@cardstack/components';
import SuffixedInput from '@cardstack/components/Input/SuffixedInput/SuffixedInput';

import ValidationMessage from './components/ValidationMessage';
import { strings } from './strings';
import { useProfileSlugScreen } from './useProfileSlugScreen';

const ProfileSlugScreen = () => {
  const {
    username,
    onUsernameChange,
    isUsernameValid,
    showValidationMessage,
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
          <ValidationMessage
            isVisible={showValidationMessage}
            isValid={isUsernameValid}
            message={message}
          />
          <Text variant="pageDescriptionSmall">
            {strings.input.description}
          </Text>
        </Container>
      </Container>
      <Container flex={0.2}>
        <Button
          onPress={onContinuePress}
          disabled={!(isUsernameValid && showValidationMessage)}
        >
          {strings.buttons.continue}
        </Button>
      </Container>
    </SafeAreaView>
  );
};

export default memo(ProfileSlugScreen);

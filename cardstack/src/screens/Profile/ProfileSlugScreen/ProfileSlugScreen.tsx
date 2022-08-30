import React, { memo, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Container,
  Text,
  Button,
  ValidationMessage,
  NavigationStackHeader,
  SuffixedInput,
} from '@cardstack/components';

import { strings } from './strings';
import { useProfileSlugScreen } from './useProfileSlugScreen';

const ProfileSlugScreen = () => {
  const {
    slug,
    onSlugChange,
    slugValidation: { slugAvailable, detail: slugFeedback },
    canContinue,
    onContinuePress,
    onSkipPress,
  } = useProfileSlugScreen();

  // handles SafeAreaView bottom spacing for consistency
  const { bottom } = useSafeAreaInsets();

  const containerStyles = useMemo(
    () => ({
      paddingBottom: bottom,
    }),
    [bottom]
  );

  return (
    <Container
      flex={1}
      style={containerStyles}
      backgroundColor="backgroundDarkPurple"
    >
      <NavigationStackHeader
        canGoBack={false}
        onSkipPress={onSkipPress}
        backgroundColor="backgroundDarkPurple"
        leftIconProps={{ iconSize: 'small' }}
      />
      <Container paddingHorizontal={5} flex={1} justifyContent="space-between">
        <Container flex={0.8}>
          <Container width="90%" paddingBottom={4}>
            <Text variant="pageHeader">{strings.header}</Text>
          </Container>

          <Container paddingBottom={1}>
            <SuffixedInput
              value={slug}
              onChangeText={onSlugChange}
              suffixText={strings.input.domainSuffix}
            />
          </Container>
          <Container width="100%">
            <ValidationMessage
              isVisible={!!slugFeedback}
              isValid={slugAvailable}
              message={slugFeedback}
            />
            <Text variant="pageDescriptionSmall">
              {strings.input.description}
            </Text>
          </Container>
        </Container>
        <Container flex={0.2} justifyContent="flex-end" paddingBottom={5}>
          <Button onPress={onContinuePress} blocked={!canContinue}>
            {strings.buttons.continue}
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(ProfileSlugScreen);

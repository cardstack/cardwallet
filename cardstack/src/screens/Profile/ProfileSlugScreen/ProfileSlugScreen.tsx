import React, { memo } from 'react';

import {
  Container,
  Text,
  Button,
  ValidationMessage,
  SuffixedInput,
  PageWithStackHeader,
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
  } = useProfileSlugScreen();

  return (
    <PageWithStackHeader
      canGoBack={false}
      showSkip
    >
      <Container flex={1} justifyContent="space-between">
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
    </PageWithStackHeader>
  );
};

export default memo(ProfileSlugScreen);

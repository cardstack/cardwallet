import React, { memo } from 'react';

import {
  Container,
  Text,
  Button,
  ValidationMessage,
  SuffixedInput,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
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
    triggerSkipProfileCreation,
    purchaseDisclaimer,
  } = useProfileSlugScreen();

  return (
    <PageWithStackHeader
      canGoBack={false}
      skipPressCallback={triggerSkipProfileCreation}
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

          <Text paddingTop={2} variant="pageDescriptionSmall">
            {purchaseDisclaimer}
          </Text>
        </Container>
      </Container>
      <PageWithStackHeaderFooter>
        <Button onPress={onContinuePress} blocked={!canContinue}>
          {strings.buttons.continue}
        </Button>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(ProfileSlugScreen);

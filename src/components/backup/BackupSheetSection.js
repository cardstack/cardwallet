import analytics from '@segment/analytics-react-native';
import React, { useEffect } from 'react';

import { Button, Container, Icon, Text } from '@cardstack/components';

export default function BackupSheetSection({
  descriptionText,
  onPrimaryAction,
  onSecondaryAction,
  primaryButtonTestId,
  primaryLabel,
  secondaryButtonTestId,
  secondaryLabel,
  titleText,
  type,
}) {
  useEffect(() => {
    analytics.track('BackupSheet shown', {
      category: 'backup',
      label: type,
    });
  }, [type]);

  return (
    <Container paddingHorizontal={8} paddingTop={6}>
      <Container
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={8}
      >
        <Icon color="teal" name="upload-cloud" size={60} />
        <Text fontSize={20} fontWeight="600" marginVertical={2}>
          {titleText}
        </Text>
        <Text color="blueText" marginBottom={12} textAlign="center">
          {descriptionText}
        </Text>
      </Container>

      <Container>
        <Button
          marginBottom={2}
          onPress={onPrimaryAction}
          testID={primaryButtonTestId}
          width="100%"
        >
          {primaryLabel}
        </Button>
        <Button
          onPress={onSecondaryAction}
          testID={secondaryButtonTestId}
          variant="secondary"
          width="100%"
        >
          {secondaryLabel}
        </Button>
      </Container>
    </Container>
  );
}

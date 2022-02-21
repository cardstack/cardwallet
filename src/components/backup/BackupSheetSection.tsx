import React from 'react';

import { Button, Container, Icon, Text } from '@cardstack/components';

interface BackupSheetSectionProps {
  descriptionText: string;
  onPrimaryAction: () => Promise<void>;
  onSecondaryAction: () => Promise<void>;
  primaryButtonTestId?: string;
  primaryLabel: string;
  secondaryButtonTestId?: string;
  secondaryLabel: string;
  titleText: string;
}

export default function BackupSheetSection({
  descriptionText,
  onPrimaryAction,
  onSecondaryAction,
  primaryButtonTestId,
  primaryLabel,
  secondaryButtonTestId,
  secondaryLabel,
  titleText,
}: BackupSheetSectionProps) {
  return (
    <Container paddingHorizontal={8} paddingTop={6}>
      <Container
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={8}
      >
        <Icon color="tealDark" name="upload-cloud" size={60} />
        <Text fontSize={20} marginVertical={2} weight="bold">
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

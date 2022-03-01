import React, { memo } from 'react';
import { CardPressable, Container, Text } from '@cardstack/components';

interface RowProps {
  title?: string;
  description?: string;
  disabled?: boolean;
  onPress?: () => void;
}

export const TextOptionRow = memo(
  ({ title, description, disabled = false, onPress }: RowProps) => {
    const textColor = disabled ? 'grayText' : 'black';

    return (
      <CardPressable disabled={disabled} onPress={onPress}>
        <Container
          backgroundColor="white"
          borderColor="borderGray"
          borderRadius={10}
          borderWidth={1}
          marginBottom={2}
          overflow="hidden"
          paddingBottom={4}
          paddingHorizontal={5}
          paddingVertical={3}
        >
          {title && (
            <Text
              color={textColor}
              fontWeight="600"
              paddingBottom={2}
              variant="body"
            >
              {title}
            </Text>
          )}

          {description && (
            <Text color={textColor} variant="subText">
              {description}
            </Text>
          )}
        </Container>
      </CardPressable>
    );
  }
);

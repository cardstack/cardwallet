import React from 'react';

import { Container, Text, Touchable } from '@cardstack/components';

import { strings } from '../strings';

interface SectionWrapperProps {
  children: JSX.Element;
  onPress?: () => void;
  disabled?: boolean;
  hasDetailsText?: boolean;
}

export const SectionWrapper = ({
  children,
  onPress,
  disabled = false,
  hasDetailsText = true,
}: SectionWrapperProps) => (
  <Touchable
    width="100%"
    borderColor="borderGray"
    borderRadius={10}
    borderWidth={1}
    padding={4}
    onPress={onPress}
    disabled={disabled}
  >
    {hasDetailsText && (
      <Container position="absolute" top={8} right={8}>
        {!disabled && <Text size="xs">{strings.details}</Text>}
      </Container>
    )}
    {children}
  </Touchable>
);

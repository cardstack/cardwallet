import React from 'react';

import {
  Button,
  Container,
  Text,
  Touchable,
  Icon,
} from '@cardstack/components';

import { strings } from './';

interface CreateProfileErrorProps {
  onPressRetry: () => void;
  onPressSupport: () => void;
  errorMessage?: string;
}

export const CreateProfileError = ({
  onPressRetry,
  onPressSupport,
  errorMessage,
}: CreateProfileErrorProps) => (
  <Container flex={1} justifyContent="space-between" paddingBottom={10}>
    <Container
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingHorizontal={5}
    >
      <Container flexDirection="row" alignItems="center" paddingBottom={3}>
        <Icon name="info" size={20} color="error" />
        <Text
          color="white"
          fontWeight="bold"
          fontSize={20}
          textAlign="center"
          paddingLeft={3}
        >
          {strings.profileError.title}
        </Text>
      </Container>
      {errorMessage && (
        <Text color="grayText" textAlign="center">
          {errorMessage}
        </Text>
      )}
    </Container>
    <Container>
      <Button
        paddingHorizontal={4}
        marginBottom={6}
        alignSelf="center"
        onPress={onPressRetry}
      >
        {strings.buttons.retry}
      </Button>
      <Touchable onPress={onPressSupport} alignSelf="center">
        <Text color="white" fontSize={16} weight="semibold">
          {strings.buttons.support}
        </Text>
      </Touchable>
    </Container>
  </Container>
);

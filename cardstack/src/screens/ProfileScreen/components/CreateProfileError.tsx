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
}

export const CreateProfileError = ({
  onPressRetry,
  onPressSupport,
}: CreateProfileErrorProps) => (
  <Container flex={1} justifyContent="space-between" paddingVertical={10}>
    <Container flex={1} paddingHorizontal={5}>
      <Container flexDirection="row" alignItems="center" paddingBottom={3}>
        <Icon name="info" size={20} color="error" />
        <Text paddingLeft={3} color="white" variant="pageHeader">
          {strings.profileError.title}
        </Text>
      </Container>
      <Text color="grayText">{strings.profileError.message}</Text>
    </Container>
    <Container>
      <Button marginBottom={6} alignSelf="center" onPress={onPressRetry}>
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

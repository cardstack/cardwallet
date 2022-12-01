import React, { memo } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
} from '@cardstack/components';

import { strings } from './strings';
import { useNotificationsPermissionScreen } from './useNotificationsPermissionScreen';

const NotificationsPermissionScreen = () => {
  const {
    handleSkipOnPress,
    handleEnableNotificationsOnPress,
  } = useNotificationsPermissionScreen();

  return (
    <PageWithStackHeader
      canGoBack={false}
      skipPressCallback={handleSkipOnPress}
    >
      <Container flex={1} width="90%">
        <Text variant="pageHeader" paddingBottom={4}>
          {strings.title}
        </Text>
        <Text color="grayText" letterSpacing={0.4}>
          {strings.description}
        </Text>
      </Container>
      <PageWithStackHeaderFooter>
        <CenteredContainer>
          <Button onPress={handleEnableNotificationsOnPress} marginBottom={4}>
            {strings.confirmBtn}
          </Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(NotificationsPermissionScreen);

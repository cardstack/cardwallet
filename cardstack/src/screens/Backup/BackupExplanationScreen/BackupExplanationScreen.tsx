import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { memo, useCallback } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
} from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';

import { BackupRouteParams } from '../types';

import { strings } from './strings';

const BackupExplanationScreen = () => {
  const { dispatch: navDispatch, navigate } = useNavigation();
  const { params } = useRoute<RouteType<BackupRouteParams>>();

  const handleBackupOnPress = useCallback(() => {
    navigate(Routes.BACKUP_MANUAL_BACKUP, params);
  }, [navigate, params]);

  const handleLaterOnPress = useCallback(() => {
    navDispatch(StackActions.popToTop());
  }, [navDispatch]);

  return (
    <PageWithStackHeader canGoBack={false}>
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
          <Button onPress={handleBackupOnPress} marginBottom={4}>
            {strings.primaryBtn}
          </Button>
          <Button variant="linkWhite" onPress={handleLaterOnPress}>
            {strings.secondaryBtn}
          </Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupExplanationScreen);

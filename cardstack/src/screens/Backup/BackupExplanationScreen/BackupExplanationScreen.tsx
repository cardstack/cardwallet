import { StackActions, useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
} from '@cardstack/components';

import { ButtonLink } from '../components/ButtonLink';

import { strings } from './strings';

const BackupExplanationScreen = () => {
  const { dispatch: navDispatch } = useNavigation();

  const handleBackupOnPress = useCallback(() => {
    // TODO
  }, []);

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
          <Button onPress={handleBackupOnPress}>{strings.primaryBtn}</Button>
          <ButtonLink onPress={handleLaterOnPress}>
            {strings.secondaryBtn}
          </ButtonLink>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupExplanationScreen);

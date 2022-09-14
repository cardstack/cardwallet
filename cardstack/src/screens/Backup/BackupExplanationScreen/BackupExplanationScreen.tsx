import { StackActions, useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useMemo } from 'react';

import {
  Button,
  Container,
  PageWithStackHeader,
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

  const FooterComponent = useMemo(
    () => (
      <Container flex={1} alignItems="center">
        <Button onPress={handleBackupOnPress}>{strings.primaryBtn}</Button>
        <ButtonLink onPress={handleLaterOnPress}>
          {strings.secondaryBtn}
        </ButtonLink>
      </Container>
    ),
    [handleBackupOnPress, handleLaterOnPress]
  );

  return (
    <PageWithStackHeader canGoBack={false} footer={FooterComponent}>
      <Container width="90%">
        <Text variant="pageHeader" paddingBottom={4}>
          {strings.title}
        </Text>
        <Text color="grayText" letterSpacing={0.4}>
          {strings.description}
        </Text>
      </Container>
    </PageWithStackHeader>
  );
};

export default memo(BackupExplanationScreen);

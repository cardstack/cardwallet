import { StackActions, useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useMemo } from 'react';

import {
  Button,
  Container,
  PageWithStackHeader,
  Text,
  Touchable,
} from '@cardstack/components';
import { hitSlop } from '@cardstack/utils';

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
        <Touchable
          onPress={handleLaterOnPress}
          paddingVertical={5}
          hitSlop={hitSlop.medium}
        >
          <Text color="white" fontSize={16} weight="semibold">
            {strings.secondaryBtn}
          </Text>
        </Touchable>
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

import { useRoute, useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';

import {
  Button,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  ScrollView,
  SeedPhraseTable,
  Text,
} from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

import { strings } from './strings';

interface RouteParams {
  seedPhrase: string;
}

const BackupSuccessScreen = () => {
  const { goBack } = useNavigation();
  const { params } = useRoute<RouteType<RouteParams>>();

  const handleDeletePressed = useCallback(() => {
    // TBD
  }, []);

  const handleDonePressed = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <PageWithStackHeader showSkip={false} canGoBack={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container flex={1} width="90%">
          <Text variant="pageHeader" paddingBottom={8}>
            {strings.title}
          </Text>
        </Container>
        <SeedPhraseTable seedPhrase={params.seedPhrase} allowCopy hideOnOpen />
        <Text
          color="grayText"
          letterSpacing={0.28}
          fontSize={11}
          paddingVertical={2}
          paddingBottom={8}
        >
          {strings.disclaimer}
        </Text>
      </ScrollView>
      <PageWithStackHeaderFooter>
        <Button marginBottom={5} variant="red" onPress={handleDeletePressed}>
          {strings.deleteBackupBtn}
        </Button>
        <Button onPress={handleDonePressed}>{strings.primaryBtn}</Button>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupSuccessScreen);

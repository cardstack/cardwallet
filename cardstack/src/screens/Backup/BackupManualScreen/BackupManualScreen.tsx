import { useNavigation, useRoute } from '@react-navigation/native';
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
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { listStyle } from '@cardstack/utils';

import { BackupRouteParams } from '../types';

import { strings } from './strings';

const BackupManualScreen = () => {
  const { navigate } = useNavigation();

  const { params } = useRoute<RouteType<BackupRouteParams>>();

  const handleNextOnPress = useCallback(() => {
    navigate(Routes.BACKUP_SEEDPHRASE_CONFIRMATION, params);
  }, [params, navigate]);

  return (
    <PageWithStackHeader showSkip={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={listStyle.paddingBottom}
      >
        <Container flex={1} width="90%" marginBottom={10}>
          <Text variant="pageHeader" paddingBottom={4}>
            {strings.title}
          </Text>
          <Text color="grayText" letterSpacing={0.4}>
            {strings.description}
          </Text>
        </Container>
        <SeedPhraseTable seedPhrase={params.seedPhrase} allowCopy hideOnOpen />
      </ScrollView>
      <PageWithStackHeaderFooter>
        <Button onPress={handleNextOnPress}>{strings.primaryBtn}</Button>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupManualScreen);

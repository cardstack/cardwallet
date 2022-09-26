import { useRoute, useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';

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

import { strings } from './strings';

const style = StyleSheet.create({
  scrollview: {
    paddingBottom: 30,
  },
});

interface RouteParams {
  seedPhrase: string;
}

const BackupManualScreen = () => {
  const { navigate } = useNavigation();
  const { params } = useRoute<RouteType<RouteParams>>();

  const handleNextOnPress = useCallback(() => {
    navigate(Routes.BACKUP_SEEDPHRASE_CONFIRMATION, params);
  }, [params, navigate]);

  return (
    <PageWithStackHeader showSkip={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollview}
      >
        <Container flex={1} width="90%" marginBottom={10}>
          <Text variant="pageHeader" paddingBottom={4}>
            {strings.title}
          </Text>
          <Text color="grayText" letterSpacing={0.4}>
            {strings.description}
          </Text>
        </Container>
        <SeedPhraseTable seedPhrase={params.seedPhrase} allowCopy />
      </ScrollView>
      <PageWithStackHeaderFooter>
        <Button onPress={handleNextOnPress}>{strings.primaryBtn}</Button>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupManualScreen);

import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import {
  BackupStatus,
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  ScrollView,
  SeedPhraseTable,
  Text,
} from '@cardstack/components';
import { Device } from '@cardstack/utils';

import { ButtonLink } from '../components/ButtonLink';

import { strings } from './strings';
import { useBackupRecoveryPhraseScreen } from './useBackupRecoveryPhraseScreen';

const style = StyleSheet.create({
  scrollview: {
    paddingBottom: 30,
  },
});

const BackupRecoveryPhraseScreen = () => {
  const {
    handleCloudBackupOnPress,
    handleManualBackupOnPress,
    latestBackup,
  } = useBackupRecoveryPhraseScreen();

  const backupStatus = useMemo(
    () => <BackupStatus status={latestBackup ? 'success' : 'missing'} />,
    [latestBackup]
  );

  return (
    <PageWithStackHeader headerChildren={backupStatus}>
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
        <SeedPhraseTable />
        <Text
          color="grayText"
          letterSpacing={0.28}
          fontSize={11}
          paddingVertical={2}
        >
          {strings.disclaimer}
        </Text>
      </ScrollView>
      <PageWithStackHeaderFooter>
        <CenteredContainer>
          <Button onPress={handleCloudBackupOnPress}>
            {strings.primaryBtn(Device.cloudPlatform)}
          </Button>
          <ButtonLink onPress={handleManualBackupOnPress}>
            {strings.secondaryBtn}
          </ButtonLink>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupRecoveryPhraseScreen);

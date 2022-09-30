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
    handleDeleteOnPress,
    hasManualBackup,
    hasCloudBackup,
    seedPhrase,
  } = useBackupRecoveryPhraseScreen();

  const backupStatusComponent = useMemo(
    () => <BackupStatus status={hasManualBackup ? 'success' : 'missing'} />,
    [hasManualBackup]
  );

  const cloudBackupButtonsConfig = useMemo(() => {
    const backupToCloudConfig = {
      variant: 'linkWhite' as const,
      onPress: handleCloudBackupOnPress,
    };

    const deleteCloudBackup = {
      variant: 'red' as const,
      onPress: handleDeleteOnPress,
    };

    return hasCloudBackup ? deleteCloudBackup : backupToCloudConfig;
  }, [hasCloudBackup, handleCloudBackupOnPress, handleDeleteOnPress]);

  return (
    <PageWithStackHeader
      headerChildren={backupStatusComponent}
      showSkip={false}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollview}
      >
        <Container flex={1} width="90%" marginBottom={8}>
          <Text variant="pageHeader" paddingBottom={2}>
            {strings.title}
          </Text>
          {!hasManualBackup && (
            <Text color="grayText" letterSpacing={0.4}>
              {strings.description}
            </Text>
          )}
        </Container>
        <SeedPhraseTable seedPhrase={seedPhrase} hideOnOpen allowCopy />
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
          {!hasManualBackup && (
            <Button onPress={handleManualBackupOnPress} marginBottom={4}>
              {strings.manualBackupBtn}
            </Button>
          )}
          <Button {...cloudBackupButtonsConfig}>
            {hasCloudBackup
              ? strings.deleteBackupBtn(Device.cloudPlatform)
              : strings.cloudBackupBtn(Device.cloudPlatform)}
          </Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupRecoveryPhraseScreen);

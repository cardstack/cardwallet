import React, { memo, useMemo } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

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
import { useBackupSeedPhraseScreen } from './useBackupSeedPhraseScreen';

const style = StyleSheet.create({
  scrollview: {
    paddingBottom: 30,
  },
});

const BackupSeedPhraseScreen = () => {
  const {
    handleCloudBackupOnPress,
    handleManualBackupOnPress,
    handleDeleteOnPress,
    hasManualBackup,
    hasCloudBackup,
    seedPhrase,
  } = useBackupSeedPhraseScreen();

  const backupStatusComponent = useMemo(
    () => <BackupStatus status={hasManualBackup ? 'success' : 'missing'} />,
    [hasManualBackup]
  );

  const cloudBackupButtonsConfig = useMemo(() => {
    const backupToCloudAsPrimaryConfig = {
      onPress: handleCloudBackupOnPress,
    };

    const backupToCloudConfig = {
      variant: 'linkWhite' as const,
      onPress: handleCloudBackupOnPress,
    };

    const deleteCloudBackup = {
      variant: 'red' as const,
      onPress: handleDeleteOnPress,
    };

    if (hasCloudBackup) {
      return deleteCloudBackup;
    }

    if (hasManualBackup) {
      return backupToCloudAsPrimaryConfig;
    }

    return backupToCloudConfig;
  }, [
    hasCloudBackup,
    hasManualBackup,
    handleCloudBackupOnPress,
    handleDeleteOnPress,
  ]);

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
          <Text color="grayText" letterSpacing={0.4}>
            {strings.description}
          </Text>
        </Container>
        <SeedPhraseTable
          seedPhrase={seedPhrase}
          hideOnOpen
          allowCopy
          loading={!seedPhrase}
        />
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

export default memo(BackupSeedPhraseScreen);

import React from 'react';

import {
  horizontalNonStackingInterpolator,
  Routes,
} from '@cardstack/navigation';
import {
  BackupCloudPasswordScreen,
  BackupExplanationScreen,
  BackupRecoveryPhraseScreen,
  BackupSeedPhraseConfirmationScreen,
  BackupManualScreen,
  BackupSuccessScreen,
} from '@cardstack/screens';

import { StackType } from '../types';

export const BackupScreenGroup = ({ Stack }: { Stack: StackType }) => (
  <Stack.Group
    screenOptions={{
      ...horizontalNonStackingInterpolator,
      presentation: 'card',
      detachPreviousScreen: false,
    }}
  >
    <Stack.Screen
      component={BackupExplanationScreen}
      name={Routes.BACKUP_EXPLANATION}
    />
    <Stack.Screen
      component={BackupCloudPasswordScreen}
      name={Routes.BACKUP_CLOUD_PASSWORD}
    />
    <Stack.Screen
      component={BackupRecoveryPhraseScreen}
      name={Routes.BACKUP_RECOVERY_PHRASE}
    />
    <Stack.Screen
      component={BackupSeedPhraseConfirmationScreen}
      name={Routes.BACKUP_SEEDPHRASE_CONFIRMATION}
    />
    <Stack.Screen
      component={BackupManualScreen}
      name={Routes.BACKUP_MANUAL_BACKUP}
    />
    <Stack.Screen
      component={BackupSuccessScreen}
      name={Routes.BACKUP_SUCCESS}
    />
  </Stack.Group>
);

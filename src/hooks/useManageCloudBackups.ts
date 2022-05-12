import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { BackupFile } from 'react-native-cloud-fs';
import { useDispatch } from 'react-redux';
import useWallets from './useWallets';
import { Routes } from '@cardstack/navigation/routes';
import { Device } from '@cardstack/utils/device';
import {
  deleteAllBackups,
  fetchAllBackups,
  fetchUserDataFromCloud,
} from '@rainbow-me/handlers/cloudBackup';
import walletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import { AppDispatch } from '@rainbow-me/redux/store';
import { walletsUpdate } from '@rainbow-me/redux/wallets';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

const { cloudPlatform } = Device;

export default function useManageCloudBackups() {
  const dispatch = useDispatch();
  const { wallets } = useWallets();
  const { navigate } = useNavigation();

  const manageCloudBackups = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: `Manage ${cloudPlatform} Backups`,
        options: [
          `Restore from ${cloudPlatform} Backups`,
          `Delete All ${cloudPlatform} Backups`,
          'Cancel',
        ],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      async (buttonIndex: number) => {
        if (buttonIndex === 0) {
          const { files } = await fetchAllBackups();
          const filteredFiles = files.filter(
            file => file.name.indexOf('backup_') !== -1
          );
          if (filteredFiles.length > 1) {
            // Choose backup
            promptToChooseFromBackups(filteredFiles, navigate);
          } else {
            const userData = await fetchUserDataFromCloud();
            navigate(Routes.RESTORE_SHEET, {
              fromSettings: true,
              step: walletBackupStepTypes.cloud,
              userData: userData,
            });
          }
        } else if (buttonIndex === 1) {
          // Delete wallet with confirmation
          deleteWalletWithConfirmation(wallets, dispatch);
        }
      }
    );
  }, [dispatch, navigate, wallets]);

  return { manageCloudBackups };
}

function promptToChooseFromBackups(
  filteredFiles: BackupFile[],
  navigate: (...args: any[]) => void
) {
  const displayOptions = filteredFiles.map(displayNameForBackup);
  showActionSheetWithOptions(
    {
      cancelButtonIndex: displayOptions.length,
      message: `Choose your ${cloudPlatform} backups`,
      options: displayOptions.concat(['Cancel']),
    },
    async (buttonIndex: number) => {
      showActionSheetWithOptions(
        {
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0,
          message: `This will override all your current wallets. Are you sure?`,
          options: [`Yes, Restore my backup`, 'Cancel'],
        },
        async (actionIndex: number) => {
          if (actionIndex === 0) {
            const potentialUserData = await fetchUserDataFromCloud();
            // If the backup is the latest, we use the normal restore flow
            // To preserve account names, colors, etc
            const isUserdataAvailableForThisBackup =
              potentialUserData
                ?.toString()
                .indexOf(filteredFiles[buttonIndex].name) !== -1;
            let backupSelected = null;
            let userData = null;
            if (isUserdataAvailableForThisBackup) {
              userData = potentialUserData;
            } else {
              backupSelected = filteredFiles[buttonIndex];
            }

            navigate(Routes.RESTORE_SHEET, {
              backupSelected,
              fromSettings: true,
              step: walletBackupStepTypes.cloud,
              userData,
            });
          }
        }
      );
    }
  );
}

const displayNameForBackup = (file: BackupFile, i: number) => {
  const ts = Number(
    file.name
      .replace(/^.*backup_/, '')
      .replace('.backup_', '')
      .replace('.json', '')
      .replace('.icloud', '')
  );
  const date = new Date(ts);
  const name = `Backup ${i + 1} - ${date.toLocaleDateString()}`;
  return name;
};

function deleteWalletWithConfirmation(wallets: any, dispatch: AppDispatch) {
  showActionSheetWithOptions(
    {
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      message: `Are you sure you want to delete your ${cloudPlatform} wallet backups?`,
      options: [`Confirm and Delete Backups`, 'Cancel'],
    },
    async (buttonIndex: number) => {
      if (buttonIndex === 0) {
        const newWallets = { ...wallets };
        Object.keys(newWallets).forEach(key => {
          newWallets[key].backedUp = undefined;
          newWallets[key].backupDate = undefined;
          newWallets[key].backupFile = undefined;
          newWallets[key].backupType = undefined;
        });

        await dispatch(walletsUpdate(newWallets));

        // Delete all backups (debugging)
        await deleteAllBackups();

        Alert.alert('Backups Deleted Succesfully');
      }
    }
  );
}

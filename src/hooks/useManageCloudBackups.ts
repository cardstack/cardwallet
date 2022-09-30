import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import useWallets from './useWallets';
import { deleteAllBackups } from '@cardstack/models/rn-cloud';
import { Device } from '@cardstack/utils/device';
import { AppDispatch } from '@rainbow-me/redux/store';
import { walletsUpdate } from '@rainbow-me/redux/wallets';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

const { cloudPlatform } = Device;

export default function useManageCloudBackups() {
  const dispatch = useDispatch();
  const { wallets } = useWallets();

  const manageCloudBackups = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: `Manage ${cloudPlatform} Backups`,
        options: [`Delete All ${cloudPlatform} Backups`, 'Cancel'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      async (buttonIndex: number) => {
        if (buttonIndex === 0) {
          // Delete wallet with confirmation
          deleteWalletWithConfirmation(wallets, dispatch);
        }
      }
    );
  }, [dispatch, wallets]);

  return { manageCloudBackups };
}

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

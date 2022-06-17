import { filter, find } from 'lodash';
import { getKeychainIntegrityState } from './localstorage/globalSettings';
import { Navigation, Routes } from '@cardstack/navigation';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import WalletTypes from '@rainbow-me/helpers/walletTypes';

import store from '@rainbow-me/redux/store';
import { checkKeychainIntegrity } from '@rainbow-me/redux/wallets';
import logger from 'logger';

export const runKeychainIntegrityChecks = () => {
  setTimeout(async () => {
    const keychainIntegrityState = await getKeychainIntegrityState();
    if (!keychainIntegrityState) {
      await store.dispatch(checkKeychainIntegrity());
    }
  }, 5000);
};

export const runWalletBackupStatusChecks = () => {
  const state = store.getState();
  const { selected, wallets } = state.wallets;

  // count how many non-imported and non-readonly wallets are not backed up
  const rainbowWalletsNotBackedUp = filter(
    wallets,
    wallet =>
      !wallet.imported &&
      wallet.type !== WalletTypes.readOnly &&
      !wallet.backedUp
  );

  if (!rainbowWalletsNotBackedUp.length) return;

  logger.log('device has at least one wallet that is not backed up');
  const hasSelectedWallet = !!find(
    rainbowWalletsNotBackedUp,
    notBackedUpWallet => notBackedUpWallet.id === selected.id
  );

  logger.log('wallet not backed up that is selected?', hasSelectedWallet);

  if (Navigation.getActiveRouteName() !== Routes.WALLET_SCREEN) {
    return;
  }

  // if one of them is selected, show the default BackupSheet
  if (selected && hasSelectedWallet) {
    logger.log('showing default BackupSheet');

    Navigation.handleAction(Routes.BACKUP_SHEET, { single: true });

    return;
  }

  // otherwise, show the BackupSheet redirecting to the WalletSelectionList

  logger.log('showing BackupSheet with existing_user step');

  Navigation.handleAction(Routes.BACKUP_SHEET, {
    single: true,
    step: WalletBackupStepTypes.existing_user,
  });

  return;
};

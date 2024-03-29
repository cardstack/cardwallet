import assert from 'assert';

import { captureException } from '@sentry/react-native';
import { forEach, startsWith } from 'lodash';

import { getSeedPhrase } from '@cardstack/models/secure-storage';
import { BackupUserData, BackedUpData } from '@cardstack/types';

import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import { AllRainbowWallets, RainbowWallet } from '@rainbow-me/model/wallet';
import logger from 'logger';

import { encryptAndSaveDataToCloud, getDataFromCloud } from './rn-cloud';

export const cloudBackupPasswordMinLength = 8;
export const iCloudPasswordRules = `minlength: ${cloudBackupPasswordMinLength}; required: digit;`;

export const isBackedUpWallet = (wallet: RainbowWallet) =>
  wallet.backedUp &&
  wallet.backupDate &&
  wallet.backupFile &&
  typeof wallet.backupFile === 'string' &&
  wallet.backupType === WalletBackupTypes.cloud;

export async function backupWalletToCloud(
  password: string,
  wallet: RainbowWallet
) {
  const now = Date.now();

  const seedPhrase = await getSeedPhrase(wallet.id);

  const data = {
    createdAt: now,
    seedPhrase,
  };

  logger.log('calling encryptAndSaveDataToCloud');

  return encryptAndSaveDataToCloud(data, password, `backup_${now}.json`);
}

export function findLatestBackUp(wallets: AllRainbowWallets) {
  let latestBackup: string | undefined;
  let backedWallet: RainbowWallet | undefined;

  forEach(wallets, wallet => {
    // Check if there's a wallet backed up
    if (isBackedUpWallet(wallet)) {
      // If there is one, let's grab the latest backup
      // @ts-expect-error isBackupWallet checks undefined values
      if (!latestBackup || wallet?.backupDate > latestBackup) {
        latestBackup = wallet.backupDate;
        backedWallet = wallet;
      }
    }
  });

  return backedWallet;
}

export async function restoreCloudBackup(
  password: string,
  userData?: BackupUserData,
  backupSelected?: string
) {
  try {
    const backedUpWallet = userData && findLatestBackUp(userData?.wallets);

    const filename = backupSelected || backedUpWallet?.backupFile;

    if (!filename) {
      return;
    }

    const data = await getDataFromCloud(password, filename);

    if (!data) {
      return;
    }

    const { seedPhrase, secrets } = data;

    // Handles old backup structure
    if (!seedPhrase && userData) {
      const latestBackedUpWallet = Object.values(userData.wallets).find(
        wallet => wallet.backupFile === filename
      );

      const oldSeedPhrase = await findAndParseOldSeed(
        secrets,
        latestBackedUpWallet?.id
      );

      return { restoredSeed: oldSeedPhrase, backedUpWallet };
    }

    return { restoredSeed: seedPhrase, backedUpWallet };
  } catch (e) {
    logger.sentry('Error while restoring back up');
    captureException(e);
    throw e;
  }
}

export async function findAndParseOldSeed(
  backedUpData?: BackedUpData,
  walletId?: string
) {
  if (!backedUpData || !walletId) {
    logger.sentry('no backupData or walletId found');

    return;
  }

  const backupKey = Object.keys(backedUpData).find(key =>
    startsWith(key, `${walletId}_`)
  );

  if (!backupKey) {
    logger.sentry('no backupKey found');

    return;
  }

  try {
    const valueStr = backedUpData[backupKey];

    assert(typeof valueStr === 'string', 'Seed is not a string');

    const { seedphrase } = JSON.parse(valueStr);

    return seedphrase;
  } catch (e) {
    logger.sentry('error in findAndParseOldSeed', e);
    captureException(e);
  }
}

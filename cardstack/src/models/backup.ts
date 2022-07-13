import assert from 'assert';

import { captureException } from '@sentry/react-native';
import { forEach, startsWith } from 'lodash';

import { getSeedPhrase } from '@cardstack/models/secure-storage';

import {
  encryptAndSaveDataToCloud,
  getDataFromCloud,
} from '@rainbow-me/handlers/cloudBackup';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import { AllRainbowWallets, RainbowWallet } from '@rainbow-me/model/wallet';
import logger from 'logger';

interface BackedUpData {
  [key: string]:
    | string
    | {
        version: number;
        wallets: AllRainbowWallets;
      };
}

interface BackupUserData {
  wallets: AllRainbowWallets;
}

export interface ICloudBackupData {
  createdAt: number;
  updatedAt: number;
  secrets?: { [key: string]: string };
  seedPhrase?: string;
}

const isBackedUpWallet = (wallet: RainbowWallet) =>
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
  let filename: string | undefined;

  forEach(wallets, wallet => {
    // Check if there's a wallet backed up
    if (isBackedUpWallet(wallet)) {
      // If there is one, let's grab the latest backup
      // @ts-expect-error isBackupWallet checks undefined values
      if (!latestBackup || wallet?.backupDate > latestBackup) {
        filename = wallet.backupFile;
        latestBackup = wallet.backupDate;
      }
    }
  });

  return filename;
}

export async function restoreCloudBackup(
  password: string,
  userData: BackupUserData | null,
  backupSelected?: string
) {
  try {
    const filename =
      backupSelected || (userData && findLatestBackUp(userData?.wallets));

    if (!filename) {
      return;
    }

    const data = await getDataFromCloud(password, filename);

    if (!data) {
      throw new Error('Invalid password');
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

      return oldSeedPhrase;
    }

    return seedPhrase;
  } catch (e) {
    logger.sentry('Error while restoring back up');
    captureException(e);
  }
}

async function findAndParseOldSeed(
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
    logger.sentry('no backupKeyfound');

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

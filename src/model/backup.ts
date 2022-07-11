import assert from 'assert';
import { captureException } from '@sentry/react-native';
import { forEach, startsWith } from 'lodash';
import {
  encryptAndSaveDataToCloud,
  getDataFromCloud,
} from '../handlers/cloudBackup';
import WalletBackupTypes from '../helpers/walletBackupTypes';

import {
  AllRainbowWallets,
  createOrImportWallet,
  RainbowWallet,
} from './wallet';

import { getSeedPhrase } from '@cardstack/models/secure-storage';
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
  backupSelected: string | null
) {
  try {
    const filename =
      backupSelected || (userData && findLatestBackUp(userData?.wallets));

    if (!filename) {
      return false;
    }

    const data = await getDataFromCloud(password, filename);

    if (!data) {
      throw new Error('Invalid password');
    }

    if (userData) {
      const firstEligibleWallet = Object.values(userData.wallets).find(
        isBackedUpWallet
      );

      const seed =
        data.seedPhrase ||
        (await findAndParseOldSeed(data.secrets, firstEligibleWallet?.id));

      await createOrImportWallet({ seed });
    }
  } catch (e) {
    logger.sentry('Error while restoring back up');
    captureException(e);
  }
}

async function findAndParseOldSeed(
  backedUpData?: BackedUpData,
  walletId?: string
) {
  if (!backedUpData || walletId) {
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

    assert(typeof valueStr == 'string', 'Seed is not a string');

    const { seedphrase } = JSON.parse(valueStr);

    return seedphrase;
  } catch (e) {
    logger.sentry('error in findAndParseOldSeed');
    captureException(e);
  }
}

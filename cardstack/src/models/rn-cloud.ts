import { captureException } from '@sentry/react-native';
import { OptionalUnion } from 'globals';
import RNCloudFs, { ListFilesResult } from 'react-native-cloud-fs';
import { CARDWALLET_MASTER_KEY } from 'react-native-dotenv';
import RNFS from 'react-native-fs';

import { iCloudAlertConfig } from '@cardstack/hooks';
import { BackupUserData, BackupSecretsData } from '@cardstack/types';
import { Device } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import AesEncryptor from '@rainbow-me/handlers/aesEncryption';
import logger from 'logger';

export const REMOTE_BACKUP_WALLET_DIR = 'cardstack.com/wallet-backups';
export const USERDATA_FILE = 'UserData.json';
const encryptor = new AesEncryptor();

export const CLOUD_BACKUP_ERRORS = {
  ERROR_DECRYPTING_DATA: 'Error decrypting data',
  ERROR_GETTING_ENCRYPTED_DATA: 'Error getting encrypted data!',
  GENERAL_ERROR: 'Backup failed',
  INTEGRITY_CHECK_FAILED: 'Backup integrity check failed',
  KEYCHAIN_ACCESS_ERROR: `Couldn't read items from keychain`,
  SPECIFIC_BACKUP_NOT_FOUND: 'No backup found with that name',
  UKNOWN_ERROR: 'Unknown Error',
  WALLET_BACKUP_STATUS_UPDATE_FAILED: 'Update wallet backup status failed',
  USER_CANCELED_DRIVE_API_AUTH: 'User canceled Google Drive OAuth',
};

/**
 * Goes through the cloud backup directory and deletes all files.
 */
export const deleteAllCloudBackups = async () => {
  try {
    if (Device.isAndroid) {
      await RNCloudFs.loginIfNeeded();
    }

    const backups = await RNCloudFs.listFiles({
      scope: 'hidden',
      targetPath: REMOTE_BACKUP_WALLET_DIR,
    });

    await Promise.all(
      backups.files.map(async file => {
        await RNCloudFs.deleteFromCloud(file);
      })
    );
  } catch (error) {
    logger.log('[BACKUP] Failed to delete all backups: ', error);
  }
};

/**
 * syncCloudIOS is an iOS-only method that returns a boolean value.
 * There's no sync method on Android.
 * @returns boolean
 */
export const syncCloudIOS = async (): Promise<boolean> => RNCloudFs.syncCloud();

/**
 * isIOSCloudBackupAvailable is an iOS-only method that returns a boolean value.
 * There's no check on Android.
 * @returns boolean
 */
export const isIOSCloudBackupAvailable = async (): Promise<boolean> =>
  RNCloudFs.isAvailable();

const getBackupDocumentByFilename = (
  backups: ListFilesResult,
  filename: string
) => {
  const filenameMatcher = [
    filename,
    `.${filename}.icloud`,
    `${REMOTE_BACKUP_WALLET_DIR}/${filename}`,
  ];

  const document = backups.files.find(file =>
    filenameMatcher.includes(file.name)
  );

  return document;
};

/**
 * Searches the cloud backup directory to find a file that matches the filename param.
 * @returns BackupSecretsData | undefined
 */
export const getDataFromCloud = async (
  backupPassword: string,
  filename: string
): Promise<OptionalUnion<BackupSecretsData, BackupUserData> | undefined> => {
  if (Device.isAndroid) {
    await RNCloudFs.loginIfNeeded();
  }

  const backups = await RNCloudFs.listFiles({
    scope: 'hidden',
    targetPath: REMOTE_BACKUP_WALLET_DIR,
  });

  if (!backups || !backups.files || !backups.files.length) {
    logger.sentry('[BACKUP] No backups found');

    return;
  }

  const document = getBackupDocumentByFilename(backups, filename);

  if (!document) {
    logger.sentry('[BACKUP] No backup found with that name: ', filename);

    return;
  }

  const encryptedData = Device.isIOS
    ? await RNCloudFs.getIcloudDocument(document.name)
    : await RNCloudFs.getGoogleDriveDocument(document.id);

  if (!encryptedData) {
    logger.sentry(
      `[BACKUP] We couldn't get the encrypted data for: `,
      document
    );

    return;
  }

  logger.sentry('[BACKUP] Got cloud document ', filename);

  const decryptedBackupData = await encryptor.decrypt(
    backupPassword,
    encryptedData
  );

  if (!decryptedBackupData) {
    logger.sentry(`[BACKUP] We couldn't decrypt the data `, filename);

    return;
  }

  const backedUpData = JSON.parse(decryptedBackupData);
  return backedUpData;
};

/**
 * Receives an object with UserData or secrets and saves to the cloud directory using encryption.
 * Returns undefined in case of error.
 * @returns the backup filename | undefined
 */
export const encryptAndSaveDataToCloud = async (
  data: BackupSecretsData | BackupUserData,
  password: string,
  filename: string
) => {
  try {
    const encryptedData = await encryptor.encrypt(
      password,
      JSON.stringify(data)
    );

    if (!encryptedData) {
      logger.sentry(`[BACKUP] We couldn't encrypt the data`);

      return;
    }

    // Store it on the FS first
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
    await RNFS.writeFile(path, encryptedData, 'utf8');
    const sourceUri = { path };
    const destinationPath = `${REMOTE_BACKUP_WALLET_DIR}/${filename}`;
    const mimeType = 'application/json';
    // Only available to our app
    const scope = 'hidden';

    if (Device.isAndroid) {
      await RNCloudFs.loginIfNeeded();
    }

    const result = await RNCloudFs.copyToCloud({
      mimeType,
      scope,
      sourcePath: sourceUri,
      targetPath: destinationPath,
    });

    // Now we need to verify the file has been stored in the cloud
    const exists = await RNCloudFs.fileExists(
      Device.isIOS
        ? {
            scope,
            targetPath: destinationPath,
          }
        : {
            fileId: result,
            scope,
          }
    );

    if (!exists) {
      const error = new Error(CLOUD_BACKUP_ERRORS.INTEGRITY_CHECK_FAILED);
      captureException(error);

      return;
    }

    await RNFS.unlink(path);

    return filename;
  } catch (e) {
    if (e.code === 'canceled') {
      throw new Error(CLOUD_BACKUP_ERRORS.USER_CANCELED_DRIVE_API_AUTH);
    }

    logger.sentry('[BACKUP] Error during encryptAndSaveDataToCloud', e);
    captureException(e);
  }
};

/**
 * Saves or updates the UserData.json file in the cloud directory.
 * It calls `encryptAndSaveDataToCloud`.
 * @returns the backup filename
 */
export const backupUserDataIntoCloud = async (data: BackupUserData) =>
  encryptAndSaveDataToCloud(data, CARDWALLET_MASTER_KEY, USERDATA_FILE);

/**
 * Gets the UserData.json file in the cloud directory.
 * It calls `getDataFromCloud`.
 * @returns BackupUserData
 */
export const fetchUserDataFromCloud = async () => {
  if (Device.isIOS) {
    const isAvailable = await isIOSCloudBackupAvailable();

    if (isAvailable) {
      logger.log('[BACKUP] syncing iCloud');
      await syncCloudIOS();
    } else {
      Alert(iCloudAlertConfig);

      return;
    }
  }

  return getDataFromCloud(CARDWALLET_MASTER_KEY, USERDATA_FILE);
};

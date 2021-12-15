import assert from 'assert';
import { captureException } from '@sentry/react-native';
import { sortBy } from 'lodash';
import RNCloudFs, { BackupFile } from 'react-native-cloud-fs';
import { CARDWALLET_MASTER_KEY } from 'react-native-dotenv';
import RNFS from 'react-native-fs';
import AesEncryptor from '../handlers/aesEncryption';
import { logger } from '../utils';
import { Device } from '@cardstack/utils/device';

const REMOTE_BACKUP_WALLET_DIR: string = 'cardstack.com/wallet-backups';
const USERDATA_FILE: string = 'UserData.json';
const encryptor = new AesEncryptor();

export const CLOUD_BACKUP_ERRORS = {
  ERROR_DECRYPTING_DATA: 'Error decrypting data',
  ERROR_GETTING_ENCRYPTED_DATA: 'Error getting encrypted data!',
  GENERAL_ERROR: 'Backup failed',
  INTEGRITY_CHECK_FAILED: 'Backup integrity check failed',
  KEYCHAIN_ACCESS_ERROR: `Couldn't read items from keychain`,
  NO_BACKUPS_FOUND: 'No backups found',
  SPECIFIC_BACKUP_NOT_FOUND: 'No backup found with that name',
  UKNOWN_ERROR: 'Unknown Error',
  WALLET_BACKUP_STATUS_UPDATE_FAILED: 'Update wallet backup status failed',
};

export function logoutFromGoogleDrive() {
  Device.isAndroid && RNCloudFs.logout();
}

// This is used for dev purposes only!
export async function deleteAllBackups() {
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
}

export async function fetchAllBackups() {
  if (Device.isAndroid) {
    await RNCloudFs.loginIfNeeded();
  }
  return RNCloudFs.listFiles({
    scope: 'hidden',
    targetPath: REMOTE_BACKUP_WALLET_DIR,
  });
}

export async function encryptAndSaveDataToCloud(
  data: any,
  password: string,
  filename: string
) {
  // Encrypt the data
  try {
    const encryptedData = await encryptor.encrypt(
      password,
      JSON.stringify(data)
    );
    assert(encryptedData, 'Encrypted data should not be null');

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
      logger.sentry('Backup doesnt exist after completion');
      const error = new Error(CLOUD_BACKUP_ERRORS.INTEGRITY_CHECK_FAILED);
      captureException(error);
      throw error;
    }

    await RNFS.unlink(path);
    return filename;
  } catch (e) {
    logger.sentry('Error during encryptAndSaveDataToCloud', e);
    captureException(e);
    throw new Error(CLOUD_BACKUP_ERRORS.GENERAL_ERROR);
  }
}

function getICloudDocument(filename: string): Promise<any> {
  return RNCloudFs.getIcloudDocument(filename);
}

function getGoogleDriveDocument(id: string): Promise<any> {
  return RNCloudFs.getGoogleDriveDocument(id);
}

export async function syncCloud(): Promise<any> {
  if (Device.isIOS) {
    return RNCloudFs.syncCloud();
  }
  return true;
}

export async function getDataFromCloud(
  backupPassword: string,
  filename: string | null = null
): Promise<any> {
  if (Device.isAndroid) {
    await RNCloudFs.loginIfNeeded();
  }

  const backups = await RNCloudFs.listFiles({
    scope: 'hidden',
    targetPath: REMOTE_BACKUP_WALLET_DIR,
  });

  if (!backups || !backups.files || !backups.files.length) {
    logger.sentry('No backups found');
    const error = new Error(CLOUD_BACKUP_ERRORS.NO_BACKUPS_FOUND);
    captureException(error);
    throw error;
  }

  let document: BackupFile | undefined;
  if (filename) {
    if (Device.isIOS) {
      // .icloud are files that were not yet synced
      document = backups.files.find(
        file => file.name === filename || file.name === `.${filename}.icloud`
      );
    } else {
      document = backups.files.find(file => {
        return file.name === `${REMOTE_BACKUP_WALLET_DIR}/${filename}`;
      });
    }

    if (!document) {
      logger.sentry('No backup found with that name!', filename);
      const error = new Error(CLOUD_BACKUP_ERRORS.SPECIFIC_BACKUP_NOT_FOUND);
      captureException(error);
      throw error;
    }
  } else {
    const sortedBackups = sortBy(backups.files, 'lastModified').reverse();
    document = sortedBackups[0];
  }
  const encryptedData = Device.isIOS
    ? await getICloudDocument(document.path)
    : await getGoogleDriveDocument(document.id);

  if (encryptedData) {
    logger.sentry('Got cloud document ', filename);
    const backedUpDataStringified = await encryptor.decrypt(
      backupPassword,
      encryptedData
    );
    if (backedUpDataStringified) {
      const backedUpData = JSON.parse(backedUpDataStringified);
      return backedUpData;
    } else {
      logger.sentry('We couldnt decrypt the data');
      const error = new Error(CLOUD_BACKUP_ERRORS.ERROR_DECRYPTING_DATA);
      captureException(error);
      throw error;
    }
  }
  logger.sentry('We couldnt get the encrypted data');
  const error = new Error(CLOUD_BACKUP_ERRORS.ERROR_GETTING_ENCRYPTED_DATA);
  captureException(error);
  throw error;
}

export async function backupUserDataIntoCloud(data: any) {
  const filename = USERDATA_FILE;
  const password = CARDWALLET_MASTER_KEY;
  return encryptAndSaveDataToCloud(data, password, filename);
}

export async function fetchUserDataFromCloud() {
  const filename = USERDATA_FILE;
  const password = CARDWALLET_MASTER_KEY;
  return getDataFromCloud(password, filename);
}

export const cloudBackupPasswordMinLength = 8;

export function isCloudBackupPasswordValid(password?: string) {
  return !!(
    password &&
    password !== '' &&
    password.length >= cloudBackupPasswordMinLength
  );
}

export function isCloudBackupAvailable() {
  if (Device.isIOS) {
    return RNCloudFs.isAvailable();
  }
  return true;
}
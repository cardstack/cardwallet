import * as sentry from '@sentry/react-native';
import RNCloudFs from 'react-native-cloud-fs';
import RNFS from 'react-native-fs';

import { BackupUserData } from '@cardstack/types';
import { Device } from '@cardstack/utils';

import AesEncryptor from '@rainbow-me/handlers/aesEncryption';
import { EthereumWalletType } from '@rainbow-me/helpers/walletTypes';
import logger from 'logger';

import {
  deleteAllCloudBackups,
  encryptAndSaveDataToCloud,
  getDataFromCloud,
  REMOTE_BACKUP_WALLET_DIR,
  USERDATA_FILE,
} from '../rn-cloud';

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

const mockedBackupData: BackupUserData = {
  wallets: {
    wallet_1666814362880: {
      addresses: [
        {
          address: '0xa47052b',
          avatar: null,
          color: 6,
          index: 0,
          label: '',
        },
      ],
      backedUp: true,
      color: 0,
      id: 'wallet_1666814362880',
      imported: true,
      manuallyBackedUp: true,
      damaged: false,
      name: 'My Wallet',
      primary: true,
      type: EthereumWalletType.mnemonic,
    },
  },
};

const mockedListFiles = {
  files: [
    {
      name: 'backup',
      id: '123456',
      path: 'path/to/file', // iOS only
      lastModified: '1657732642021',
    },
    {
      name: USERDATA_FILE,
      id: '98765',
      path: 'path/to/file', // iOS only
      lastModified: '1657732642021',
    },
  ],
};

const mockUserData = {
  createdAt: 1657732642021,
  seedPhrase: 'foo bar',
};

jest.mock('@rainbow-me/handlers/aesEncryption');

describe('rn-cloud', () => {
  Device.isIOS = true;
  Device.cloudPlatform = 'iCloud';

  beforeAll(() => {
    logger.sentry = jest.fn();
    logger.log = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('deleteAllCloudBackups', () => {
    RNCloudFs.listFiles = jest.fn().mockReturnValue(mockedListFiles);
    RNCloudFs.deleteFromCloud = jest.fn().mockResolvedValue(true);

    afterAll(() => {
      jest.clearAllMocks();
    });

    it(`should get backup files from cloud drive and delete them`, async () => {
      await deleteAllCloudBackups();

      expect(RNCloudFs.listFiles).toBeCalledTimes(1);
      expect(RNCloudFs.deleteFromCloud).toBeCalledTimes(2);
    });
  });

  describe('getDataFromCloud', () => {
    const password = 'password';

    afterAll(() => {
      jest.clearAllMocks();
    });

    it(`should return undefined if there's no backup file on the remote directory`, async () => {
      RNCloudFs.listFiles = jest.fn().mockReturnValue({ files: [] });
      const filename = 'UserData.json';

      const response = await getDataFromCloud(password, filename);

      expect(logger.sentry).toBeCalledWith('[BACKUP] No backups found');
      expect(response).toBe(undefined);
    });

    it(`should return undefined if there's no file in the remote dir that matches the filename passed`, async () => {
      RNCloudFs.listFiles = jest.fn().mockReturnValue(mockedListFiles);

      const response = await getDataFromCloud(password, 'foo');

      expect(logger.sentry).toBeCalledWith(
        '[BACKUP] No backup found with that name: ',
        'foo'
      );

      expect(response).toBe(undefined);
    });

    it(`should return undefined if encrypted backup document wasn't found`, async () => {
      RNCloudFs.listFiles = jest.fn().mockReturnValue(mockedListFiles);
      RNCloudFs.getIcloudDocument = jest.fn().mockResolvedValue(false);

      const filename = 'UserData.json';
      const response = await getDataFromCloud(password, filename);

      expect(logger.sentry).toBeCalledWith(
        `[BACKUP] We couldn't get the encrypted data for: `,
        mockedListFiles.files[1]
      );

      expect(response).toBe(undefined);
    });

    it(`should return undefined if the document couldn't be decrypted`, async () => {
      RNCloudFs.listFiles = jest.fn().mockReturnValue(mockedListFiles);
      RNCloudFs.getIcloudDocument = jest.fn().mockResolvedValue('backup');
      AesEncryptor.prototype.decrypt = jest.fn().mockResolvedValue(undefined);

      const filename = 'UserData.json';
      const response = await getDataFromCloud(password, filename);

      expect(logger.sentry).toBeCalledWith(
        `[BACKUP] We couldn't decrypt the data `,
        filename
      );

      expect(response).toBe(undefined);
    });

    it(`should return a parsed backup data JSON file`, async () => {
      RNCloudFs.listFiles = jest.fn().mockReturnValue(mockedListFiles);
      RNCloudFs.getIcloudDocument = jest.fn().mockResolvedValue('backup');
      const stringifyMockedBackupData = JSON.stringify(mockedBackupData);

      AesEncryptor.prototype.decrypt = jest
        .fn()
        .mockResolvedValue(stringifyMockedBackupData);

      const filename = 'UserData.json';
      const response = await getDataFromCloud(password, filename);

      expect(response).toMatchObject(mockedBackupData);
    });
  });

  describe('encryptAndSaveDataToCloud', () => {
    const captureExceptionSpy = jest.spyOn(sentry, 'captureException');
    RNFS.writeFile = jest.fn();
    const password = 'password';
    const filename = 'backup';
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
    const sourceUri = { path };

    afterAll(() => {
      jest.clearAllMocks();
    });

    it(`should return undefined if there's an error encrypting the file`, async () => {
      AesEncryptor.prototype.encrypt = jest.fn().mockResolvedValue(undefined);

      const response = await encryptAndSaveDataToCloud(
        mockUserData,
        password,
        filename
      );

      expect(AesEncryptor.prototype.encrypt).toBeCalledWith(
        password,
        JSON.stringify(mockUserData)
      );

      expect(logger.sentry).toBeCalledWith(
        `[BACKUP] We couldn't encrypt the data`
      );

      expect(response).toBe(undefined);
    });

    it(`should call RNFS to save file locally first`, async () => {
      AesEncryptor.prototype.encrypt = jest
        .fn()
        .mockResolvedValue('encryptedBackup');

      await encryptAndSaveDataToCloud(mockUserData, password, filename);

      expect(RNFS.writeFile).toBeCalledWith(path, 'encryptedBackup', 'utf8');
    });

    it(`should call copyToCloud with the correct params`, async () => {
      AesEncryptor.prototype.encrypt = jest
        .fn()
        .mockResolvedValue('encryptedBackup');

      RNCloudFs.copyToCloud = jest.fn();

      await encryptAndSaveDataToCloud(mockUserData, password, filename);

      expect(RNCloudFs.copyToCloud).toBeCalledWith({
        mimeType: 'application/json',
        scope: 'hidden',
        sourcePath: sourceUri,
        targetPath: `${REMOTE_BACKUP_WALLET_DIR}/${filename}`,
      });
    });

    it(`should call RNCloudFs.fileExists with the correct params for iOS`, async () => {
      AesEncryptor.prototype.encrypt = jest
        .fn()
        .mockResolvedValue('encryptedBackup');

      RNCloudFs.fileExists = jest.fn();
      RNCloudFs.copyToCloud = jest.fn();

      await encryptAndSaveDataToCloud(mockUserData, password, filename);

      expect(RNCloudFs.fileExists).toBeCalledWith({
        scope: 'hidden',
        targetPath: `${REMOTE_BACKUP_WALLET_DIR}/${filename}`,
      });
    });

    it(`should call RNCloudFs.fileExists with the correct params for Android`, async () => {
      Device.isAndroid = true;
      Device.isIOS = false;

      AesEncryptor.prototype.encrypt = jest
        .fn()
        .mockResolvedValue('encryptedBackup');

      RNCloudFs.copyToCloud = jest.fn().mockReturnValue('fileId');
      RNCloudFs.loginIfNeeded = jest.fn();
      RNCloudFs.fileExists = jest.fn();

      await encryptAndSaveDataToCloud(mockUserData, password, filename);

      expect(RNCloudFs.fileExists).toBeCalledWith({
        scope: 'hidden',
        fileId: 'fileId',
      });
    });

    it(`should return undefined if file doesn't exist in the cloud`, async () => {
      AesEncryptor.prototype.encrypt = jest
        .fn()
        .mockResolvedValue('encryptedBackup');

      RNCloudFs.copyToCloud = jest.fn().mockReturnValue('');
      RNCloudFs.fileExists = jest.fn().mockResolvedValue(false);

      const response = await encryptAndSaveDataToCloud(
        mockUserData,
        password,
        filename
      );

      expect(captureExceptionSpy).toBeCalled();
      expect(response).toBe(undefined);
    });

    it(`should return the filename if saving to the cloud was successful`, async () => {
      AesEncryptor.prototype.encrypt = jest
        .fn()
        .mockResolvedValue('encryptedBackup');

      RNCloudFs.copyToCloud = jest.fn().mockReturnValue('');
      RNCloudFs.fileExists = jest.fn().mockResolvedValue(true);
      RNFS.unlink = jest.fn().mockResolvedValue(true);

      const response = await encryptAndSaveDataToCloud(
        mockUserData,
        password,
        filename
      );

      expect(RNFS.unlink).toBeCalledWith(path);
      expect(response).toBe(filename);
    });
  });
});

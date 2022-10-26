import RNCloudFs from 'react-native-cloud-fs';

import { Device } from '@cardstack/utils';

import AesEncryptor from '@rainbow-me/handlers/aesEncryption';
import logger from 'logger';

import { deleteAllCloudBackups, getDataFromCloud } from '../rn-cloud';

const mockedBackupData = {
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
      type: 'mnemonic',
      backupDate: 1666966010273,
      backupFile: 'backup_1666966010171.json',
      backupType: 'cloud',
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
      name: 'UserData.json',
      id: '98765',
      path: 'path/to/file', // iOS only
      lastModified: '1657732642021',
    },
  ],
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
});

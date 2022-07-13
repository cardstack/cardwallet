import * as secureStorage from '@cardstack/models/secure-storage';

import * as cloudBackup from '@rainbow-me/handlers/cloudBackup';
import { EthereumWalletType } from '@rainbow-me/helpers/walletTypes';
import { RainbowWallet } from '@rainbow-me/model/wallet';
import logger from 'logger';

import {
  backupWalletToCloud,
  findLatestBackUp,
  restoreCloudBackup,
} from '../backup';

const oldDate = '1657724368709';
const latestDate = '1657732642021';

const wallets = {
  wallet_12121212: {
    addresses: [
      {
        address: '0xEc1eacfbb',
        avatar: null,
        color: 5,
        index: 0,
        label: '',
      },
    ],
    backedUp: true,
    color: 0,
    id: 'wallet_12121212',
    imported: false,
    name: 'My Wallet',
    primary: true,
    type: EthereumWalletType.mnemonic,
    backupDate: oldDate,
    backupFile: 'oldBackupFile.json',
    backupType: 'cloud',
  },
  wallet_13131313: {
    addresses: [
      {
        address: '0xEc1eacfbb232',
        avatar: null,
        color: 5,
        index: 0,
        label: '',
      },
    ],
    backedUp: true,
    color: 0,
    id: 'wallet_13131313',
    imported: true,
    name: 'My Wallet',
    primary: false,
    type: EthereumWalletType.mnemonic,
    backupDate: latestDate,
    backupFile: 'latestBackupFile.json',
    backupType: 'cloud',
  },
};

const password = '12345678';

describe('backup', () => {
  const mockedSeed = 'foo bar foo';

  const encryptAndSaveDataToCloud = jest
    .spyOn(cloudBackup, 'encryptAndSaveDataToCloud')
    .mockResolvedValue('filename');

  const getDataFromCloud = jest.spyOn(cloudBackup, 'getDataFromCloud');

  const getSeedPhrase = jest
    .spyOn(secureStorage, 'getSeedPhrase')
    .mockResolvedValue(mockedSeed);

  beforeAll(() => {
    logger.sentry = jest.fn();
    logger.log = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('backupWalletToCloud', () => {
    it('should call encryptedAndSaveData with the correct params', async () => {
      const wallet = { id: 'walllet_123' } as RainbowWallet;
      const now = 1657724368709;

      global.Date.now = jest.fn().mockReturnValueOnce(now);

      await backupWalletToCloud(password, wallet);

      expect(getSeedPhrase).toBeCalledWith('walllet_123');
      expect(encryptAndSaveDataToCloud).toBeCalledWith(
        {
          createdAt: now,
          seedPhrase: mockedSeed,
        },
        password,
        `backup_${now}.json`
      );
    });
  });

  describe('findLatestBackUp', () => {
    it('should return the latest valid cloud backup filename', async () => {
      const filemame = findLatestBackUp(wallets);

      expect(filemame).toBe('latestBackupFile.json');
    });

    it('should return undefined if no wallet is marked as backed up', async () => {
      const filemame = findLatestBackUp({
        wallet_12121212: { ...wallets.wallet_12121212, backedUp: false },
      });

      expect(filemame).toBeUndefined();
    });
  });

  describe('restoreCloudBackup', () => {
    it('should return undefined if no filename is found while restoring', async () => {
      const userData = {
        wallets: {
          wallet_12121212: { ...wallets.wallet_12121212, backedUp: false },
        },
      };

      const seed = await restoreCloudBackup(password, userData);

      expect(seed).toBeUndefined();
    });

    it('should throw an error if getDataFromCloud returns nothing', async () => {
      const userData = {
        wallets,
      };

      getDataFromCloud.mockResolvedValue(null);

      try {
        await restoreCloudBackup(password, userData);
      } catch (e) {
        expect(e).toEqual({
          error: 'Invalid password',
        });

        expect(logger.sentry).toBeCalledWith('Error while restoring back up');
      }
    });

    it('should return restored seed for new backup format', async () => {
      const userData = {
        wallets,
      };

      getDataFromCloud.mockResolvedValue({
        createdAt: Number(latestDate),
        updatedAt: 0,
        seedPhrase: mockedSeed,
      });

      const seed = await restoreCloudBackup(password, userData);

      expect(seed).toBe(mockedSeed);
    });

    it('should return restored seed for old backup format', async () => {
      const userData = {
        wallets,
      };

      getDataFromCloud.mockResolvedValue({
        createdAt: Number(latestDate),
        updatedAt: 0,
        secrets: {
          wallet_13131313_key: `{"id":"wallet_13131313","seedphrase": "${mockedSeed}","version":1}`,
          wallet_12121212_key: `{"id":"wallet_12121212","seedphrase": "another type of seed old backup","version":1}`,
        },
      });

      const seed = await restoreCloudBackup(password, userData);

      expect(seed).toBe(mockedSeed);
    });
  });
});

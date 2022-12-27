import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import * as reactRedux from 'react-redux';

import { useWalletCloudBackup } from '@cardstack/hooks';
import * as backupModel from '@cardstack/models/backup';
import * as rnCloud from '@cardstack/models/rn-cloud';
import { Device } from '@cardstack/utils';

import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import * as walletsActions from '@rainbow-me/redux/wallets';
import logger from 'logger';

const mockedPassword = 'passw0rd';
const mockedShowOverlay = jest.fn();
const mockedDismissOverlay = jest.fn();
const mockNavDispatch = jest.fn();

const walletMock = {
  wallet_1664823878526: {
    imported: true,
    name: 'My Wallet',
    backedUp: false,
    damaged: false,
    addresses: [
      {
        avatar: null,
        color: 2,
        index: 0,
        label: '',
        address: '0xBD88ADe042',
      },
    ],
    primary: true,
    id: 'wallet_1664823878526',
    color: 2,
    type: 'mnemonic',
  },
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    dispatch: mockNavDispatch,
  }),
  StackActions: { popToTop: jest.fn() },
}));

jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: mockedShowOverlay,
    dismissLoadingOverlay: mockedDismissOverlay,
  }),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useWallets: () => ({
    wallets: walletMock,
    selectedWallet: walletMock.wallet_1664823878526,
  }),
}));

jest.mock('react-native-cloud-fs', () => ({
  listFiles: jest.fn().mockReturnValue({
    files: [
      {
        name: 'backup',
        id: '123456',
        path: 'path/to/file', // iOS only
        lastModified: '1657732642021',
      },
    ],
  }),
  deleteFromCloud: jest.fn().mockResolvedValue(true),
}));

describe('useWalletCloudBackup', () => {
  Device.isIOS = true;
  Device.cloudPlatform = 'iCloud';
  const spyAlert = jest.spyOn(Alert, 'alert');
  const spyIsCloudAvailable = jest.spyOn(rnCloud, 'isIOSCloudBackupAvailable');

  const mockDispatchFn = jest.fn();

  jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatchFn);

  beforeAll(() => {
    logger.sentry = jest.fn();
    logger.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Backup to Cloud', () => {
    const backupWalletToCloudSpy = jest.spyOn(
      backupModel,
      'backupWalletToCloud'
    );

    const setWalletCloudBackupSpy = jest.spyOn(
      walletsActions,
      'setWalletCloudBackup'
    );

    it(`should show an Alert if iCloud isn't configured on iOS`, async () => {
      spyIsCloudAvailable.mockReturnValue(Promise.resolve(false));

      const { result } = renderHook(useWalletCloudBackup);

      await act(async () => {
        await result.current.backupToCloud({ password: mockedPassword });
      });

      expect(spyAlert).toBeCalledWith(
        'iCloud Not Enabled',
        `Looks like iCloud drive is not enabled on your device. Do you want to see how to enable it?`,
        [
          {
            text: 'Yes, Show me',
            onPress: expect.any(Function),
          },
          {
            text: 'No thanks',
            style: 'cancel',
          },
        ],
        undefined
      );
    });

    it(`should call backupWalletToCloud with the correct params`, async () => {
      spyIsCloudAvailable.mockReturnValue(Promise.resolve(true));

      backupWalletToCloudSpy.mockResolvedValue('filename');

      const { result } = renderHook(useWalletCloudBackup);

      await act(async () => {
        await result.current.backupToCloud({ password: mockedPassword });
      });

      expect(mockedShowOverlay).toBeCalledWith({
        title: walletLoadingStates.BACKING_UP_WALLET,
      });

      expect(mockDispatchFn).toBeCalled();
      expect(setWalletCloudBackupSpy).toBeCalledWith(
        walletMock.wallet_1664823878526.id,
        'filename'
      );

      expect(mockedDismissOverlay).toBeCalled();
    });

    it(`should show an Alert if backupWalletToCloud wasn't successful`, async () => {
      spyIsCloudAvailable.mockReturnValue(Promise.resolve(true));

      backupWalletToCloudSpy.mockRejectedValue(new Error());

      const { result } = renderHook(useWalletCloudBackup);

      await act(async () => {
        await result.current.backupToCloud({ password: mockedPassword });
      });

      expect(mockedShowOverlay).toBeCalledWith({
        title: walletLoadingStates.BACKING_UP_WALLET,
      });

      expect(spyAlert).toBeCalledWith(
        'Error while trying to backup wallet to iCloud',
        rnCloud.CLOUD_BACKUP_ERRORS.WALLET_BACKUP_STATUS_UPDATE_FAILED,
        undefined,
        undefined
      );
    });

    it.todo(
      `should update Redux with the wallet ID and filename if backupWalletToCloud was successful`
    );
  });

  describe('Delete Backup from Cloud', () => {
    const deleteAllCloudBackupsSpy = jest.spyOn(
      rnCloud,
      'deleteAllCloudBackups'
    );

    const setDeleteWalletCloudBackup = jest.spyOn(
      walletsActions,
      'deleteWalletCloudBackup'
    );

    it(`should show an Alert with two options: confirm and cancel`, () => {
      const { result } = renderHook(useWalletCloudBackup);

      act(() => {
        result.current.deleteCloudBackups();
      });

      expect(spyAlert).toBeCalledWith(
        `Are you sure you want to delete your ${Device.cloudPlatform} wallet backups?`,
        undefined,
        [
          {
            style: 'destructive',
            text: 'Confirm and Delete Backups',
            onPress: expect.any(Function),
          },
          {
            style: 'cancel',
            text: 'Cancel',
          },
        ],
        undefined
      );
    });

    it(`should show an Alert confirming that the deletion was successful`, async () => {
      const { result } = renderHook(useWalletCloudBackup);

      act(() => {
        result.current.deleteCloudBackups();
      });

      await waitFor(() => {
        expect(spyAlert).toBeCalled();
      });

      // tap on the confirm and delete button
      act(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spyAlert.mock.calls[0][2][0].onPress();
      });

      expect(mockedShowOverlay).toBeCalledWith({
        title: 'Deleting backup...',
      });

      await waitFor(() => {
        expect(deleteAllCloudBackupsSpy).toBeCalled();
      });

      expect(mockDispatchFn).toBeCalled();
      expect(setDeleteWalletCloudBackup).toBeCalled();

      expect(mockedDismissOverlay).toBeCalled();

      expect(spyAlert).toBeCalledWith(
        `Backup successfully deleted!`,
        undefined,
        undefined,
        undefined
      );
    });

    it(`should show an Alert if the deletion failed`, async () => {
      const { result } = renderHook(useWalletCloudBackup);

      deleteAllCloudBackupsSpy.mockRejectedValue(new Error());

      act(() => {
        result.current.deleteCloudBackups();
      });

      // tap on the confirm and delete button
      act(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spyAlert.mock.calls[0][2][0].onPress();
      });

      await waitFor(() => {
        expect(deleteAllCloudBackupsSpy).toBeCalled();
      });

      expect(spyAlert).toBeCalledWith(
        `Error deleting your backup files.`,
        'Try again in a few minutes. Make sure you have a stable internet connection.',
        undefined,
        undefined
      );
    });

    it.todo(
      `should update Redux resetting the cloud backup flags to false/undefined`
    );
  });
});

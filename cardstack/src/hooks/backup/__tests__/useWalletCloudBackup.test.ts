import { act, renderHook } from '@testing-library/react-hooks';
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

describe('useWalletCloudBackup', () => {
  Device.isIOS = true;
  Device.cloudPlatform = 'iCloud';
  const spyAlert = jest.spyOn(Alert, 'alert');
  const spyIsCloudAvailable = jest.spyOn(rnCloud, 'isIOSCloudBackupAvailable');

  const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  const mockDispatchFn = jest.fn();
  useDispatchSpy.mockReturnValue(mockDispatchFn);

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

    it.todo(`should show an Alert if backupWalletToCloud wasn't successful`);
  });

  describe('Delete Backup from Cloud', () => {
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

    it.todo(`should delete all files in the remote directory on confirm press`);
    it.todo(
      `should update Redux resetting the cloud backup flags to false/undefined`
    );

    it.todo(`should show an Alert confirming that the deletion was successful`);
    it.todo(`should show an Alert if the deletion failed`);
  });
});

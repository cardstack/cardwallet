import { act, renderHook } from '@testing-library/react-hooks';
import { Alert } from 'react-native';

import * as rnCloud from '@cardstack/models/rn-cloud';
import { Routes } from '@cardstack/navigation';
import { BackupUserData } from '@cardstack/types';

import { EthereumWalletType } from '@rainbow-me/helpers/walletTypes';
import logger from 'logger';

import { strings } from '../strings';
import { useBackupRestoreExplanationScreen } from '../useBackupRestoreExplanationScreen';

const mockNavigate = jest.fn();
const mockDismissOverlay = jest.fn();
const mockShowOverlay = jest.fn();

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

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@cardstack/navigation', () => ({
  Routes: {
    BACKUP_RESTORE_PHRASE: 'BackupRestorePhraseScreen',
    BACKUP_RESTORE_CLOUD: 'BackupRestoreCloud',
  },
  useLoadingOverlay: () => ({
    showLoadingOverlay: mockShowOverlay,
    dismissLoadingOverlay: mockDismissOverlay,
  }),
}));

describe('useBackupRestoreExplanationScreen', () => {
  const spyAlert = jest.spyOn(Alert, 'alert');

  const spyFetchUserDataFromCloud = jest.spyOn(
    rnCloud,
    'fetchUserDataFromCloud'
  );

  beforeAll(() => {
    logger.sentry = jest.fn();
    logger.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to the restore seed phrase screen after calling handleRestorePhraseOnPress', () => {
    const { result } = renderHook(useBackupRestoreExplanationScreen);

    act(() => {
      result.current.handleRestorePhraseOnPress();
    });

    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(Routes.BACKUP_RESTORE_PHRASE);
  });

  it('should navigate to the restore cloud backup screen after calling handleRestoreCloudOnPress with UserData.json as route param', async () => {
    spyFetchUserDataFromCloud.mockResolvedValueOnce(mockedBackupData);
    const { result } = renderHook(useBackupRestoreExplanationScreen);

    await act(async () => {
      await result.current.handleRestoreCloudOnPress();
    });

    expect(mockShowOverlay).toBeCalledWith({
      title: 'Fetching backup information...',
    });

    expect(spyFetchUserDataFromCloud).toBeCalledTimes(1);

    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(Routes.BACKUP_RESTORE_CLOUD, {
      userData: mockedBackupData,
    });
  });

  it(`should show an Alert if there's no backup to restore`, async () => {
    spyFetchUserDataFromCloud.mockRejectedValueOnce(undefined);
    const { result } = renderHook(useBackupRestoreExplanationScreen);

    await act(async () => {
      await result.current.handleRestoreCloudOnPress();
    });

    expect(mockShowOverlay).toBeCalledWith({
      title: 'Fetching backup information...',
    });

    expect(spyFetchUserDataFromCloud).toBeCalledTimes(1);

    expect(spyAlert).toBeCalledWith(
      strings.errorMessage.title,
      strings.errorMessage.message,
      undefined,
      undefined
    );
  });
});

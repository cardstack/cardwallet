import { useRoute } from '@react-navigation/native';
import * as sentry from '@sentry/react-native';
import { act, renderHook } from '@testing-library/react-hooks';
import { Alert } from 'react-native';

import { usePasswordInput } from '@cardstack/components';
import * as backupModel from '@cardstack/models/backup';

import { EthereumWalletType } from '@rainbow-me/helpers/walletTypes';
import logger from 'logger';

import { strings } from '../strings';
import { useBackupRestoreCloudScreen } from '../useBackupRestoreCloudScreen';

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
      type: EthereumWalletType.mnemonic,
    },
  },
};

const mockSeedPhrase =
  'loan velvet fall cluster renew animal trophy clinic adjust fix soon enrich';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

const mockDismissOverlay = jest.fn();
const mockShowOverlay = jest.fn();
const mockDismissKeyboard = jest.fn();

jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: mockShowOverlay,
    dismissLoadingOverlay: mockDismissOverlay,
  }),
  dismissKeyboardOnAndroid: () => mockDismissKeyboard,
}));

const mockedImportWallet = jest.fn();

jest.mock('@rainbow-me/hooks', () => ({
  useWalletManager: () => ({ importWallet: mockedImportWallet }),
}));

jest.mock('@cardstack/components/Input/PasswordInput/usePasswordInput', () => ({
  usePasswordInput: jest.fn(),
}));

describe('useBackupRestoreCloudScreen', () => {
  const restoreCloudBackupSpy = jest.spyOn(backupModel, 'restoreCloudBackup');
  const spyAlert = jest.spyOn(Alert, 'alert');
  const captureExceptionSpy = jest.spyOn(sentry, 'captureException');

  const mockUsePasswordInput = (
    overwriteParams: Partial<ReturnType<typeof usePasswordInput>> = {}
  ) =>
    (usePasswordInput as jest.Mock).mockImplementation(() => ({
      password: 'passw0rd',
      isValid: false,
      ...overwriteParams,
    }));

  (useRoute as jest.Mock).mockReturnValue({
    params: {
      userData: mockedBackupData,
    },
  });

  beforeAll(() => {
    logger.sentry = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should have isSubmitDisabled as true if password input is empty`, () => {
    mockUsePasswordInput({ password: undefined });

    const { result } = renderHook(useBackupRestoreCloudScreen);

    expect(result.current.isSubmitDisabled).toBe(true);
  });

  it(`should have isSubmitDisabled as false if password input has at least one character`, () => {
    mockUsePasswordInput({ password: 'p' });

    const { result } = renderHook(useBackupRestoreCloudScreen);

    expect(result.current.isSubmitDisabled).toBe(false);
  });

  it(`should call restoreCloudBackup with password and wallet data`, async () => {
    mockUsePasswordInput({ password: 'passw0rd' });

    restoreCloudBackupSpy.mockResolvedValue({
      restoredSeed: mockSeedPhrase,
      backedUpWallet: mockedBackupData.wallets.wallet_1666814362880,
    });

    const { result } = renderHook(useBackupRestoreCloudScreen);

    await act(async () => {
      await result.current.handleRestoreOnPress();
    });

    expect(restoreCloudBackupSpy).toBeCalledTimes(1);
    expect(restoreCloudBackupSpy).toBeCalledWith('passw0rd', mockedBackupData);
  });

  it(`should show an Alert and call Sentry's captureException if restoreCloudBackup returns undefined`, async () => {
    restoreCloudBackupSpy.mockResolvedValue(undefined);

    const { result } = renderHook(useBackupRestoreCloudScreen);

    await act(async () => {
      await result.current.handleRestoreOnPress();
    });

    expect(mockDismissOverlay).toBeCalledTimes(1);
    expect(spyAlert).toBeCalledWith(
      strings.errorMessage.title,
      strings.errorMessage.message,
      undefined,
      undefined
    );

    expect(captureExceptionSpy).toBeCalled();
  });

  it(`should call importWallet with restoredInfo returned data`, async () => {
    mockUsePasswordInput({ password: 'passw0rd' });

    restoreCloudBackupSpy.mockResolvedValue({
      restoredSeed: mockSeedPhrase,
      backedUpWallet: mockedBackupData.wallets.wallet_1666814362880,
    });

    const { result } = renderHook(useBackupRestoreCloudScreen);

    await act(async () => {
      await result.current.handleRestoreOnPress();
    });

    expect(mockedImportWallet).toBeCalledTimes(1);
    expect(mockedImportWallet).toBeCalledWith({
      seed: mockSeedPhrase,
      backedUpWallet: mockedBackupData.wallets.wallet_1666814362880,
    });
  });

  it(`should show error message in case of any error`, async () => {
    mockUsePasswordInput({ password: 'passw0rd' });
    restoreCloudBackupSpy.mockResolvedValue({
      restoredSeed: mockSeedPhrase,
      backedUpWallet: mockedBackupData.wallets.wallet_1666814362880,
    });

    mockedImportWallet.mockRejectedValue(new Error('Fake error'));

    const { result } = renderHook(useBackupRestoreCloudScreen);

    await act(async () => {
      await result.current.handleRestoreOnPress();
    });

    expect(mockDismissOverlay).toBeCalledTimes(2);
    expect(spyAlert).toBeCalledWith(
      strings.errorMessage.title,
      strings.errorMessage.message,
      undefined,
      undefined
    );
  });
});

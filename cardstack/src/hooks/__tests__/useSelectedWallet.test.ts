import { renderHook, act, waitFor } from '@testing-library/react-native';

import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import { useWallets } from '@rainbow-me/hooks';
import * as WalletModel from '@rainbow-me/model/wallet';

import { useSelectedWallet } from '../useSelectedWallet';

const mockedSeed = 'foo bar foo';

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

jest.mock('@rainbow-me/hooks', () => ({
  useWallets: jest.fn(),
}));

describe('useSelectedWallet', () => {
  jest.spyOn(WalletModel, 'loadSeedPhrase').mockResolvedValue(mockedSeed);

  const mockUseWallets = (
    overwriteProps?: Partial<ReturnType<typeof useWallets>>
  ) =>
    (useWallets as jest.Mock).mockImplementation(() => ({
      walletReady: true,
      selectedWallet: walletMock,
      ...overwriteProps,
    }));

  beforeEach(() => {
    mockUseWallets();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should return the account's seed phrase when wallet is ready`, async () => {
    // FakeTimers is a solution mentioned in the Testing Library docs:
    // https://callstack.github.io/react-native-testing-library/docs/understanding-act/
    // to avoid the `You called act(async () => ...) without await` error on console.
    jest.useFakeTimers();

    const { result } = renderHook(() => useSelectedWallet());

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(result.current.seedPhrase).toBe(mockedSeed);
    });
  });

  it(`should return "hasCloudBackup" as true if backedUp is true and backupType is cloud`, async () => {
    mockUseWallets({
      selectedWallet: {
        ...walletMock,
        backedUp: true,
        backupType: WalletBackupTypes.cloud,
        backupDate: '1657732642021',
        backupFile: 'latestBackupFile.json',
      },
    });

    const { result } = renderHook(() => useSelectedWallet());

    await waitFor(() => {
      expect(result.current.hasCloudBackup).toBe(true);
    });
  });

  it(`should return "hasCloudBackup" as false if backedUp is false and backupType is cloud`, async () => {
    mockUseWallets({
      selectedWallet: {
        ...walletMock,
        backedUp: false,
        backupType: WalletBackupTypes.cloud,
      },
    });

    const { result } = renderHook(() => useSelectedWallet());

    await waitFor(() => {
      expect(result.current.hasCloudBackup).toBeFalsy();
    });
  });

  it(`should return "hasCloudBackup" as false if backedUp is true and backupType is manual`, async () => {
    mockUseWallets({
      selectedWallet: {
        ...walletMock,
        backedUp: true,
        backupType: WalletBackupTypes.manual,
      },
    });

    const { result } = renderHook(() => useSelectedWallet());

    await waitFor(() => {
      expect(result.current.hasCloudBackup).toBeFalsy();
    });
  });

  it(`should return "hasManualBackup" as true if manuallyBackedUp is true`, async () => {
    mockUseWallets({
      selectedWallet: {
        ...walletMock,
        manuallyBackedUp: true,
      },
    });

    const { result } = renderHook(() => useSelectedWallet());

    await waitFor(() => {
      expect(result.current.hasManualBackup).toBe(true);
    });
  });

  it(`should return "hasManualBackup" as false if manuallyBackedUp isn't present`, async () => {
    const { result } = renderHook(() => useSelectedWallet());

    await waitFor(() => {
      expect(result.current.hasManualBackup).toBeFalsy();
    });
  });
});

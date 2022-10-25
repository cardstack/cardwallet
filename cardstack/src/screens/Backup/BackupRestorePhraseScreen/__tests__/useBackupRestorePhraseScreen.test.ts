import { act, renderHook } from '@testing-library/react-hooks';

import { useWalletSeedPhraseImport } from '@cardstack/hooks/backup/useWalletSeedPhraseImport';

import { useBackupRestorePhraseScreen } from '../useBackupRestorePhraseScreen';

const mockSeedPhrase =
  'loan velvet fall cluster renew animal trophy clinic adjust fix soon enrich';

const mockInvalidSeedPhrase =
  'seed with wrong words renew animal trophy clinic adjust fix soon enrich';

const mockPartialSeedPhrase = 'incomplete phrase';

const mockDerivedWallet = 'DERIVED_WALLET';

const mockImportWallet = jest.fn();
const mockHandleImportWallet = jest.fn();

jest.mock('@rainbow-me/hooks', () => ({
  useWalletManager: () => ({
    importWallet: mockImportWallet,
  }),
}));

jest.mock('@cardstack/models/ethers-wallet', () => ({
  deriveWalletFromSeed: jest.fn().mockImplementation(() => mockDerivedWallet),
}));

jest.mock('@cardstack/hooks/backup/useWalletSeedPhraseImport', () => ({
  useWalletSeedPhraseImport: jest.fn(),
}));

describe('useBackupRestorePhraseScreen', () => {
  const mockUseWalletSeedPhraseImport = (isSeedPhraseValid = true) =>
    (useWalletSeedPhraseImport as jest.Mock).mockImplementation(() => ({
      handleImportWallet: mockHandleImportWallet,
      isSeedPhraseValid,
    }));

  beforeEach(() => {
    mockUseWalletSeedPhraseImport();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handle wallet import on done press', async () => {
    const { result, waitFor } = renderHook(useBackupRestorePhraseScreen);

    act(() => {
      result.current.onDonePressed();
    });

    await waitFor(() => {
      expect(mockHandleImportWallet).toBeCalled();
    });
  });

  it('should update phrase but keep as NOT complete with partial phrase input', async () => {
    const { result } = renderHook(useBackupRestorePhraseScreen);

    await act(async () => {
      result.current.handlePhraseTextChange(mockPartialSeedPhrase);
    });

    expect(result.current.phrase).toMatch(mockPartialSeedPhrase);
    expect(result.current.isPhraseComplete).toBeFalsy();
  });

  it('should update phrase, mark it as complete and correct with correct phrase input', () => {
    const { result } = renderHook(useBackupRestorePhraseScreen);

    act(() => {
      result.current.handlePhraseTextChange(mockSeedPhrase);
    });

    expect(result.current.phrase).toMatch(mockSeedPhrase);
    expect(result.current.isPhraseComplete).toBeTruthy();
    expect(result.current.isPhraseWrong).toBeFalsy();
  });

  it('should set phrase as wrong after Done button press with invalid phrase input', () => {
    mockUseWalletSeedPhraseImport(false);

    const { result } = renderHook(useBackupRestorePhraseScreen);

    act(() => {
      result.current.handlePhraseTextChange(mockInvalidSeedPhrase);
    });

    act(() => {
      result.current.onDonePressed();
    });

    expect(result.current.phrase).toMatch(mockInvalidSeedPhrase);
    expect(result.current.isPhraseComplete).toBeTruthy();
    expect(result.current.isPhraseWrong).toBeTruthy();
  });

  it('should clean phrase on reset call', () => {
    const { result } = renderHook(useBackupRestorePhraseScreen);

    act(() => {
      result.current.handlePhraseTextChange(mockInvalidSeedPhrase);
    });

    act(() => {
      result.current.onResetPhrasePressed();
    });

    expect(result.current.phrase).toMatch('');
    expect(result.current.isPhraseComplete).toBeFalsy();
    expect(result.current.isPhraseWrong).toBeFalsy();
  });
});

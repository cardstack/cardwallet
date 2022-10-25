import { act, renderHook } from '@testing-library/react-hooks';

import { useBackupRestorePhraseScreen } from '../useBackupRestorePhraseScreen';

const mockSeedPhrase =
  'loan velvet fall cluster renew animal trophy clinic adjust fix soon enrich';

const mockInvalidSeedPhrase =
  'seed with wrong words renew animal trophy clinic adjust fix soon enrich';

const mockPartialSeedPhrase = 'incomplete phrase';

const mockDerivedWallet = 'DERIVED_WALLET';

const mockImportWallet = jest.fn();

jest.mock('@rainbow-me/hooks', () => ({
  useWalletManager: () => ({
    importWallet: mockImportWallet,
  }),
}));

jest.mock('@cardstack/models/ethers-wallet', () => ({
  deriveWalletFromSeed: jest.fn().mockImplementation(() => mockDerivedWallet),
}));

describe('useBackupRestorePhraseScreen', () => {
  it('should call handle wallet import on done press', () => {
    const mockHandleImportWallet = jest.fn();

    jest.mock('@cardstack/hooks', () => ({
      useWalletSeedPhraseImport: jest.fn().mockImplementationOnce(() => ({
        handleImportWallet: mockHandleImportWallet,
        isSeedPhraseValid: true,
      })),
    }));

    const { result, waitFor } = renderHook(useBackupRestorePhraseScreen);

    act(() => {
      result.current.onDonePressed();
    });

    waitFor(() => {
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

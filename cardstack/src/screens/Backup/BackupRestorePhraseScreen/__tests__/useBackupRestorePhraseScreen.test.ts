import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useBackupRestorePhraseScreen } from '../useBackupRestorePhraseScreen';

const mockSeedPhrase =
  'loan velvet fall cluster renew animal trophy clinic adjust fix soon enrich';

const mockInvalidSeedPhrase =
  'seed with wrong words renew animal trophy clinic adjust fix soon enrich';

const mockPartialSeedPhrase = 'incomplete phrase';

const mockDirtySeedPhrase =
  ' loan velvet    fall cluster renew animal trophy clinic adjust fix soon enrich ';

const mockDerivedWallet = 'DERIVED_WALLET';

const mockImportWallet = jest.fn();

jest.mock('@rainbow-me/hooks', () => ({
  useWalletManager: () => ({
    importWallet: mockImportWallet,
  }),
}));

jest.mock('@rainbow-me/utils/ethereumUtils', () => ({
  deriveAccountFromWalletInput: jest
    .fn()
    .mockImplementation(() => mockDerivedWallet),
}));

describe('useBackupRestorePhraseScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handle wallet import on done press', async () => {
    const { result } = renderHook(useBackupRestorePhraseScreen);

    act(() => {
      result.current.handlePhraseTextChange(mockSeedPhrase);
    });

    act(() => {
      result.current.onDonePressed();
    });

    await waitFor(() => {
      expect(mockImportWallet).toBeCalledWith({
        seed: mockSeedPhrase,
        checkedWallet: mockDerivedWallet,
      });
    });
  });

  it('should set phrase as valid when seed provided is valid but not well formatted', async () => {
    const { result } = renderHook(useBackupRestorePhraseScreen);

    act(() => {
      result.current.handlePhraseTextChange(mockDirtySeedPhrase);
    });

    act(() => {
      result.current.onDonePressed();
    });

    await waitFor(() => {
      expect(mockImportWallet).toBeCalledWith({
        seed: mockSeedPhrase,
        checkedWallet: mockDerivedWallet,
      });
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

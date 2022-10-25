import { act, renderHook } from '@testing-library/react-hooks';

import { useWalletSeedPhraseImport } from '@cardstack/hooks';

const mockSeedPhrase =
  'loan velvet fall cluster renew animal trophy clinic adjust fix soon enrich';

const mockInvalidSeedPhrase =
  'seed with wrong words renew animal trophy clinic adjust fix soon enrich';

const mockDirtySeedPhrase =
  ' loan velvet    fall cluster renew animal trophy clinic adjust fix soon enrich ';

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

describe('useWalletSeedPhraseImport', () => {
  it('should import wallet with clean seed and derived wallet', async () => {
    const { result } = renderHook(() =>
      useWalletSeedPhraseImport(mockDirtySeedPhrase)
    );

    await act(async () => {
      await result.current.handleImportWallet();
    });

    expect(mockImportWallet).toBeCalledWith({
      seed: mockSeedPhrase,
      checkedWallet: mockDerivedWallet,
    });
  });

  it('should return seed as valid when a valid seed is provided', () => {
    const { result } = renderHook(() =>
      useWalletSeedPhraseImport(mockSeedPhrase)
    );

    expect(result.current.isSeedPhraseValid).toBeTruthy();
  });

  it('should return seed as valid when seed provided is valid but not well formatted', () => {
    const { result } = renderHook(() =>
      useWalletSeedPhraseImport(mockDirtySeedPhrase)
    );

    expect(result.current.isSeedPhraseValid).toBeTruthy();
  });

  it('should return seed as invalid when an invalid seed is provided', () => {
    const { result } = renderHook(() =>
      useWalletSeedPhraseImport(mockInvalidSeedPhrase)
    );

    expect(result.current.isSeedPhraseValid).toBeFalsy();
  });
});

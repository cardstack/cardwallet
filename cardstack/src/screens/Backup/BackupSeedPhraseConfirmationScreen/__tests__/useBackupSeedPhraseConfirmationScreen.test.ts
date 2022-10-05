import { StackActions, useRoute } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';

import { useBackupSeedPhraseConfirmationScreen } from '../useBackupSeedPhraseConfirmationScreen';
import { seedPhraseStringToArray } from '../utils';

const mockNavDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), dispatch: mockNavDispatch }),
  useRoute: jest.fn(),
  StackActions: { pop: jest.fn() },
}));

jest.mock('@cardstack/navigation', () => ({
  Routes: {
    WALLET_SCREEN: 'WalletScreen',
  },
}));

const mockConfirmBackup = jest.fn();

jest.mock('@cardstack/hooks/backup/useWalletManualBackup', () => ({
  useWalletManualBackup: () => ({ confirmBackup: mockConfirmBackup }),
}));

const mockSeedPhrase =
  'loan velvet fall cluster renew animal trophy clinic adjust fix soon enrich';

describe('BackupSeedPhraseConfirmationScreen', () => {
  const mockParams = (overwrite: any = {}) => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        seedPhrase: mockSeedPhrase,
        ...overwrite,
      },
    }));
  };

  beforeAll(() => {
    mockParams();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should shuffle seed phrase', () => {
    const { result } = renderHook(useBackupSeedPhraseConfirmationScreen);

    expect(result.current.shuffledWords).toHaveLength(
      seedPhraseStringToArray(mockSeedPhrase).length
    );

    expect(result.current.shuffledWords.join(' ')).not.toMatch(mockSeedPhrase);
  });

  it('should add selection to selected words', () => {
    const { result } = renderHook(useBackupSeedPhraseConfirmationScreen);

    act(() => {
      result.current.handleWordPressed(0);
    });

    expect(result.current.selectedWordsIndexes).toHaveLength(1);
  });

  it('should be valid if all words are selected in the correct order', () => {
    const { result } = renderHook(useBackupSeedPhraseConfirmationScreen);

    const seedPhraseArray = seedPhraseStringToArray(mockSeedPhrase);

    // Select words in the correct order.
    seedPhraseArray.map(word => {
      const shuffedIndex = result.current.shuffledWords.findIndex(
        item => item === word
      );

      act(() => {
        result.current.handleWordPressed(shuffedIndex);
      });
    });

    expect(result.current.selectedSeedPhraseAsString).toMatch(mockSeedPhrase);
    expect(result.current.isSelectionComplete).toBeTruthy();
    expect(result.current.isSeedPhraseCorrect).toBeTruthy();
  });

  it('should be invalid if all words are selected but in the wrong order', () => {
    const { result } = renderHook(useBackupSeedPhraseConfirmationScreen);

    // Select words in order of appearance.
    result.current.shuffledWords.map((word, index) => {
      act(() => {
        result.current.handleWordPressed(index);
      });
    });

    expect(result.current.selectedSeedPhraseAsString).not.toMatch(
      mockSeedPhrase
    );

    expect(result.current.isSelectionComplete).toBeTruthy();
    expect(result.current.isSeedPhraseCorrect).toBeFalsy();
  });

  it('should confirm Backup but not pop navigation if not requested by nav params', () => {
    const { result } = renderHook(useBackupSeedPhraseConfirmationScreen);

    act(() => {
      result.current.handleConfirmPressed();
    });

    expect(mockConfirmBackup).toBeCalled();
    expect(mockNavDispatch).toBeCalledTimes(0);
  });

  it('should confirm Backup and navigate back when requested by nav params', () => {
    mockParams({ popStackOnSuccess: 2 });
    const { result } = renderHook(useBackupSeedPhraseConfirmationScreen);

    act(() => {
      result.current.handleConfirmPressed();
    });

    expect(mockConfirmBackup).toBeCalled();
    expect(mockNavDispatch).toBeCalledWith(StackActions.pop(2));
  });
});

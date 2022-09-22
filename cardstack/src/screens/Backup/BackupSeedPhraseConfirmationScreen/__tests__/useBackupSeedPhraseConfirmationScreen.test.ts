import { useRoute } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-hooks';

import { useBackupSeedPhraseConfirmationScreen } from '../useBackupSeedPhraseConfirmationScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: jest.fn(),
}));

const mockSeedPhrase =
  'bright sell trunk jalopy donut enemy car invest donut enemy car invest';

describe('BackupSeedPhraseConfirmationScreen', () => {
  const mockParams = () => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        seedPhrase: mockSeedPhrase,
        walletId: '1',
      },
    }));
  };

  beforeAll(() => {
    mockParams();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render hook', () => {
    const { result } = renderHook(useBackupSeedPhraseConfirmationScreen);

    expect(result).toBeDefined();
  });
});

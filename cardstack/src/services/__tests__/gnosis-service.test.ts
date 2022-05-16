import { getSafesInstance } from '@cardstack/models/safes-providers';

import { safesData } from '../__mocks__/safesData';
import { fetchGnosisSafes } from '../gnosis-service';

jest.mock('@cardstack/models/safes-providers', () => ({
  getSafesInstance: jest.fn(),
}));

const mockHandleAction = jest.fn();
jest.mock('@cardstack/navigation/Navigation', () => ({
  default: () => ({ handleAction: mockHandleAction }),
}));

jest.mock('@cardstack/utils', () => ({
  fetchCardCustomizationFromDID: jest.fn().mockResolvedValue({
    issuerName: 'Wyre',
    background: '#0069F9',
    patternColor: 'black',
    textColor: 'white',
    patternUrl: null,
  }),
}));

describe('Gnosis Services', () => {
  describe('fetchGnosisSafes', () => {
    it('should return safes mapped by its type', async () => {
      const mockViewSafe = jest.fn().mockResolvedValue({
        safes: safesData.fromSDK,
      });

      (getSafesInstance as jest.Mock).mockResolvedValue({
        view: mockViewSafe,
      });

      const safes = await fetchGnosisSafes('foo');

      expect(mockViewSafe).toBeCalledWith('foo');
      expect(safes).toEqual(safesData.mappedByType);
    });
  });
});

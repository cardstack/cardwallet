import { inventoryData } from '../helpers/mocks/hubMocks';
import {
  // axiosService,
  getInventories,
  // getCustodialWallet,
  // makeReservation,
} from '@cardstack/services';

jest.mock('axios');
const axios = require('axios');
jest.mock('axios', () => ({ post: jest.fn(), create: jest.fn() }));

jest.mock('@rainbow-me/references', () => ({
  shitcoins: 'JSON-MOCK-RETURN',
}));

jest.mock('@rainbow-me/react-native-payments', () => ({
  PaymentRequest: jest.mock,
}));

jest.mock('@react-native-community/async-storage', () => ({
  AsyncStorage: jest.mock,
}));

jest.mock('@react-native-community/async-storage', () => ({
  AsyncStorage: jest.mock,
}));

describe('getInventories', () => {
  it('Should return filtered data', async () => {
    const mockedResponse = Promise.resolve(inventoryData);
    axios.create.mockResolvedValue(mockedResponse);
    axios.mockResolvedValue(mockedResponse);
    expect(getInventories('hubURL', 'tokenURL')).toBe({});
  });
});

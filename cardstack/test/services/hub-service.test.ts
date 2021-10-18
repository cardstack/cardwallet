import axios from 'axios';
import {
  getInventoryDataResponse,
  inventoryData,
  reservationData,
} from '../helpers/mocks/hubMocks';

import { getInventories, makeReservation } from '@cardstack/services';

jest.mock('axios');

jest.mock('axios', () => ({
  post: jest.fn(),
  create: jest.fn(),
}));

const tokenMock = 'TOKENMOCK123@';

describe('getInventories', async () => {
  it('Should return filtered data', async () => {
    axios.get = jest.fn().mockResolvedValue(inventoryData);
    const result = await getInventories('hubURL', tokenMock);

    expect(result).toStrictEqual(getInventoryDataResponse);
  });

  it('Should return undefined with empty API response', async () => {
    axios.get = jest.fn().mockResolvedValue([]);
    const result = await getInventories('hubURL', tokenMock);

    expect(result).toStrictEqual(undefined);
  });
});

describe('makeReservation', async () => {
  it('Should return success data', async () => {
    axios.post = jest.fn().mockResolvedValue(reservationData);
    const result = await makeReservation('hubURL', tokenMock, 'SKU_MOCK');

    expect(result).toBe(reservationData.data.data);
  });

  it('Should return undefined with empty API response', async () => {
    axios.post = jest.fn().mockResolvedValue([]);
    const result = await getInventories('hubURL', tokenMock);

    expect(result).toStrictEqual(undefined);
  });
});

import axios from 'axios';

import {
  getInventoryDataResponse,
  inventoryData,
  reservationData,
  wyrePriceData,
} from '@cardstack/helpers/__mocks__/hubMocks';
import {
  getInventories,
  getWyrePrice,
  makeReservation,
} from '@cardstack/services';

jest.mock('axios');

jest.mock('axios', () => ({
  post: jest.fn(),
  create: jest.fn(),
}));

const tokenMock = 'TOKENMOCK123@';

const issuerAddress = '0x2f58630CA445Ab1a6DE2Bb9892AA2e1d60876C13';

describe('getInventories', () => {
  it('Should return filtered data', async () => {
    axios.get = jest.fn().mockResolvedValue(inventoryData);
    const result = await getInventories('hubURL', tokenMock, issuerAddress);

    expect(result).toStrictEqual(getInventoryDataResponse);
    expect(inventoryData.data.data).toHaveLength(10);
    expect(result).toHaveLength(5);
  });

  it('Should return undefined with empty API response', async () => {
    axios.get = jest.fn().mockResolvedValue([]);
    const result = await getInventories('hubURL', tokenMock, issuerAddress);

    expect(result).toStrictEqual(undefined);
  });
});

describe('makeReservation', () => {
  it('Should return success data', async () => {
    axios.post = jest.fn().mockResolvedValue(reservationData);
    const result = await makeReservation('hubURL', tokenMock, 'SKU_MOCK');

    expect(result).toBe(reservationData.data.data);
  });

  it('Should return undefined with empty API response', async () => {
    axios.post = jest.fn().mockResolvedValue([]);
    const result = await getInventories('hubURL', tokenMock, issuerAddress);

    expect(result).toStrictEqual(undefined);
  });
});

describe('getWyrePrice', () => {
  it('Should return success data', async () => {
    axios.get = jest.fn().mockResolvedValue(wyrePriceData);
    const result = await getWyrePrice('hubURL', tokenMock);

    expect(result).toBe(wyrePriceData.data.data);
  });

  it('Should return undefined with empty API response', async () => {
    axios.get = jest.fn().mockResolvedValue([]);
    const result = await getWyrePrice('hubURL', tokenMock);

    expect(result).toStrictEqual(undefined);
  });
});

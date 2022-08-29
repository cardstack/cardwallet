import axios from 'axios';

import { reservationData } from '@cardstack/helpers/__mocks__/hubMocks';
import { makeReservation } from '@cardstack/services';

jest.mock('axios');

jest.mock('axios', () => ({
  post: jest.fn(),
  create: jest.fn(),
}));

const tokenMock = 'TOKENMOCK123@';

describe('makeReservation', () => {
  it('Should return success data', async () => {
    axios.post = jest.fn().mockResolvedValue(reservationData);
    const result = await makeReservation('hubURL', tokenMock, 'SKU_MOCK');

    expect(result).toBe(reservationData.data.data);
  });
});

import { GanacheUtils } from '@cardstack/utils';

jest.mock('@rainbow-me/handlers/web3', () => ({
  web3SetHttpProvider: () => true,
}));

const mockCallback = jest.fn();

describe('ganache utils', () => {
  it('should call web3 set http provider without error', async () => {
    // arrange
    let err;

    // act
    try {
      await GanacheUtils.connect(mockCallback);
    } catch (e) {
      if (e) {
        console.error(e);
        err = e;
      }
    }

    // asset
    expect(err).toBeUndefined();
    expect(mockCallback).toBeCalled();
  });
});

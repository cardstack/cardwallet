import { renderHook } from '@testing-library/react-hooks';
import { useMerchantInfoDID } from './hooks';
import * as MerchantUtils from '@cardstack/utils/merchant-utils';

describe('useMerchantInfoDID', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetchMerchantInfoFromDID and return merchantInfo', async () => {
    const mockedDID = {
      did: 'did',
      name: 'Merchant Name',
      slug: 'Merchant slug',
      color: 'blue',
      textColor: 'white',
      ownerAddress: '0x00000000000',
    };

    const spyFetchDID = jest
      .spyOn(MerchantUtils, 'fetchMerchantInfoFromDID')
      .mockResolvedValueOnce(mockedDID);

    const { result, waitForNextUpdate } = renderHook(() =>
      useMerchantInfoDID('foo')
    );

    await waitForNextUpdate();

    expect(spyFetchDID).toBeCalledWith('foo');
    expect(spyFetchDID).toBeCalledTimes(1);
    expect(result.current.merchantInfoDID).toStrictEqual(mockedDID);
  });

  it('should call fetchMerchantInfoFromDID and return undefined if no DID is provided', async () => {
    const spyFetchDID = jest
      .spyOn(MerchantUtils, 'fetchMerchantInfoFromDID')
      .mockRejectedValueOnce(new Error('foo error'));

    const { result } = renderHook(() => useMerchantInfoDID(''));

    expect(spyFetchDID).toBeCalledWith('');
    expect(spyFetchDID).toBeCalledTimes(1);
    expect(result.current.merchantInfoDID).toStrictEqual(undefined);
  });
});

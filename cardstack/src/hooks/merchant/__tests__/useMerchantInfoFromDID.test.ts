import { renderHook } from '@testing-library/react-hooks';
import { useMerchantInfoFromDID } from '../useMerchantInfoFromDID';
import * as MerchantUtils from '@cardstack/utils/merchant-utils';

describe('useMerchantInfoFromDID', () => {
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
      useMerchantInfoFromDID('foo')
    );

    await waitForNextUpdate();

    expect(spyFetchDID).toBeCalledWith('foo');
    expect(spyFetchDID).toBeCalledTimes(1);
    expect(result.current.merchantInfoDID).toStrictEqual(mockedDID);
  });

  it('should call fetchMerchantInfoFromDID and return undefined if did is invalid', async () => {
    const spyFetchDID = jest
      .spyOn(MerchantUtils, 'fetchMerchantInfoFromDID')
      .mockRejectedValueOnce(new Error('foo error'));

    const { result } = renderHook(() =>
      useMerchantInfoFromDID('did does not exist')
    );

    expect(spyFetchDID).toBeCalledWith('did does not exist');
    expect(spyFetchDID).toBeCalledTimes(1);
    expect(result.current.merchantInfoDID).toStrictEqual(undefined);
  });

  it('should not call fetchMerchantInfoFromDID and return undefined if no DID is provided', async () => {
    const spyFetchDID = jest
      .spyOn(MerchantUtils, 'fetchMerchantInfoFromDID')
      .mockRejectedValueOnce(new Error('foo error'));

    const { result } = renderHook(() => useMerchantInfoFromDID(undefined));

    expect(spyFetchDID).not.toBeCalled();
    expect(result.current.merchantInfoDID).toStrictEqual(undefined);
  });
});

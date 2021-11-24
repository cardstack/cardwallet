import { renderHook } from '@testing-library/react-hooks';
import { useNameOrPreviewFromAddress } from '../useNameOrPreviewFromAddress';
import { updatedData } from '../../../helpers/__mocks__/dataMocks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { useAccountProfile } from '@rainbow-me/hooks';

jest.mock('logger');

jest.mock('@rainbow-me/redux/hooks', () => ({
  useRainbowSelector: jest.fn(),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useAccountProfile: jest.fn(),
}));

describe('useNameOrPreviewFromAddress', () => {
  beforeEach(() => {
    (useRainbowSelector as jest.Mock).mockImplementation(
      () => updatedData.updatedMerchantSafes
    );

    (useAccountProfile as jest.Mock).mockImplementation(() => ({
      accountAddress: '1234567890',
      accountName: 'foo',
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call useNameOrPreviewFromAddress and return accountName', async () => {
    const { result } = renderHook(() =>
      useNameOrPreviewFromAddress('1234567890')
    );

    expect(result.current.name).toStrictEqual('foo');
  });

  it('should call useNameOrPreviewFromAddress and return merchantName', async () => {
    const { result } = renderHook(() =>
      useNameOrPreviewFromAddress(updatedData.updatedMerchantSafes[0].address)
    );

    expect(result.current.name).toStrictEqual(
      updatedData.updatedMerchantSafes[0].merchantInfo.name
    );
  });
});

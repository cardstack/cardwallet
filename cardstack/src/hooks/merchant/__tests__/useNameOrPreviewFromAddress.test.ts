import { renderHook } from '@testing-library/react-native';

import { useGetSafesDataQuery } from '@cardstack/services';

import { useAccountProfile, useAccountSettings } from '@rainbow-me/hooks';

import { updatedData } from '../../../helpers/__mocks__/dataMocks';
import { useNameOrPreviewFromAddress } from '../useNameOrPreviewFromAddress';

jest.mock('logger');

jest.mock('@rainbow-me/redux/hooks', () => ({
  useRainbowSelector: jest.fn(),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useAccountProfile: jest.fn(),
  useAccountSettings: jest.fn(),
}));

jest.mock('@cardstack/services', () => ({
  useGetSafesDataQuery: jest.fn(),
}));

describe('useNameOrPreviewFromAddress', () => {
  beforeEach(() => {
    (useGetSafesDataQuery as jest.Mock).mockImplementation(() => ({
      merchantSafes: updatedData.updatedMerchantSafes,
    }));

    (useAccountProfile as jest.Mock).mockImplementation(() => ({
      accountName: 'foo',
    }));

    (useAccountSettings as jest.Mock).mockImplementation(() => ({
      accountAddress: '1234567890',
      nativeCurrency: 'usd',
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

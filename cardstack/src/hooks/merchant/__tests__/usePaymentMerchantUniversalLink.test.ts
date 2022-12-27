import { useRoute } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-native';

import { getSafeData, useGetPrepaidCardsQuery } from '@cardstack/services';

import { updatedData } from '../../../helpers/__mocks__/dataMocks';
import { usePaymentMerchantUniversalLink } from '../usePaymentMerchantUniversalLink';

const mockedDID = {
  did: 'did',
  name: 'Merchant Name',
  slug: 'Merchant slug',
  color: 'blue',
  textColor: 'white',
  ownerAddress: '0x00000000000',
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: jest.fn(),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useWallets: () => ({ selectedWallet: 'fooSelectedWallet' }),
  useAssetListData: () => ({ isLoadingAssets: false }),
  useAccountSettings: () => ({
    accountAddress: 'foo',
    nativeCurrency: 'USD',
    network: 'gnosis',
  }),
}));

jest.mock('@cardstack/models/safes-providers', () => ({
  getSafesInstance: jest.fn(),
}));

jest.mock('@cardstack/services', () => ({
  getSafeData: jest.fn(),
  useGetPrepaidCardsQuery: jest.fn(),
}));

jest.mock('@cardstack/utils', () => ({
  useWorker: () => ({
    callback: jest.fn(),
    error: false,
    isLoading: false,
    setError: jest.fn(),
    setIsLoading: jest.fn(),
  }),
  deviceUtils: { isIOS14: false },
}));

jest.mock('@cardstack/models/web3-instance', () => ({
  Web3Instance: () => ({
    get: jest.fn(),
  }),
}));

describe('usePaymentMerchantUniversalLink', () => {
  beforeEach(() => {
    (getSafeData as jest.Mock).mockImplementation(() => ({
      infoDID: mockedDID,
    }));

    (useGetPrepaidCardsQuery as jest.Mock).mockImplementation(() => ({
      prepaidCards: updatedData.updatedPrepaidCards,
      isLoadingCards: false,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call usePaymentMerchantUniversalLink', async () => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        merchantAddress: '0x7bAeEbbd7Fd1f41f3DA69A08f8E053C8CCBb592b',
        network: 'sokol',
        amount: 1,
        currency: 'USD',
      },
    }));

    const { result } = renderHook(() => usePaymentMerchantUniversalLink());

    expect(result.current.prepaidCards.length).toBe(
      updatedData.updatedPrepaidCards.length
    );

    expect(result.current.data).toStrictEqual({
      type: 'payMerchant',
      infoDID: undefined,
      amount: 1,
      merchantSafe: '0x7bAeEbbd7Fd1f41f3DA69A08f8E053C8CCBb592b',
      currency: 'USD',
      qrCodeNetwork: 'sokol',
    });
  });

  it('should call usePaymentMerchantUniversalLink and return nativeCurrency if no currency specified in url', async () => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        merchantAddress: '0x7bAeEbbd7Fd1f41f3DA69A08f8E053C8CCBb592b',
        network: 'sokol',
        amount: 1,
      },
    }));

    const { result } = renderHook(() => usePaymentMerchantUniversalLink());

    expect(result.current.data.currency).toBe('USD');
  });

  it('should call usePaymentMerchantUniversalLink and return no amount if no amount is provided in url', async () => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        merchantAddress: '0x7bAeEbbd7Fd1f41f3DA69A08f8E053C8CCBb592b',
        network: 'sokol',
      },
    }));

    const { result } = renderHook(() => usePaymentMerchantUniversalLink());

    expect(result.current.data.amount).toBe('');
  });
});

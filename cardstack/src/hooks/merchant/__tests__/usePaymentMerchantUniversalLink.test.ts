import { renderHook } from '@testing-library/react-hooks';
import { useRoute } from '@react-navigation/native';
import { updatedData } from '../../../../test/helpers/mocks/dataMocks';
import { usePaymentMerchantUniversalLink } from '../usePaymentMerchantUniversalLink';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { getSafeData } from '@cardstack/services';

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
}));

jest.mock('@rainbow-me/redux/hooks', () => ({
  useRainbowSelector: jest.fn(),
}));

jest.mock('@cardstack/models/safes-providers', () => ({
  getSafesInstance: jest.fn(),
}));

jest.mock('@cardstack/services', () => ({
  getSafeData: jest.fn(),
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

jest.mock('@cardstack/models/hd-provider', () => ({
  HDProvider: () => ({
    reset: jest.fn(),
  }),
}));

describe('usePaymentMerchantUniversalLink', () => {
  beforeEach(() => {
    (useRainbowSelector as jest.Mock).mockImplementation(
      () => updatedData.updatedPrepaidCards
    );

    (getSafeData as jest.Mock).mockImplementation(() => ({
      infoDID: mockedDID,
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
        amount: 100,
        currency: 'SPD',
      },
    }));

    const { result } = renderHook(() => usePaymentMerchantUniversalLink());

    expect(result.current.prepaidCards.length).toBe(
      updatedData.updatedPrepaidCards.length
    );

    expect(result.current.data).toStrictEqual({
      type: 'payMerchant',
      infoDID: undefined,
      spendAmount: 100,
      merchantSafe: '0x7bAeEbbd7Fd1f41f3DA69A08f8E053C8CCBb592b',
      currency: 'SPD',
    });
  });

  it('should call usePaymentMerchantUniversalLink and return SPD if no currency specified in url', async () => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        merchantAddress: '0x7bAeEbbd7Fd1f41f3DA69A08f8E053C8CCBb592b',
        network: 'sokol',
        amount: 100,
      },
    }));

    const { result } = renderHook(() => usePaymentMerchantUniversalLink());

    expect(result.current.data.currency).toBe('SPD');
  });

  it('should call usePaymentMerchantUniversalLink and return amount 0 if no amount is provided in url', async () => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        merchantAddress: '0x7bAeEbbd7Fd1f41f3DA69A08f8E053C8CCBb592b',
        network: 'sokol',
      },
    }));

    const { result } = renderHook(() => usePaymentMerchantUniversalLink());

    expect(result.current.data.spendAmount).toBe(0);
  });

  it('should call usePaymentMerchantUniversalLink and return network sokol if no network is provided in url', async () => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        merchantAddress: '0x7bAeEbbd7Fd1f41f3DA69A08f8E053C8CCBb592b',
      },
    }));

    const { result } = renderHook(() => usePaymentMerchantUniversalLink());

    expect(result.current.data.spendAmount).toBe(0);
  });
});

import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';
import { useIAP, Product, Purchase } from 'react-native-iap';

import { useAccountProfile } from '@rainbow-me/hooks';
import logger from 'logger';

import { usePurchaseProfile } from '../usePurchaseProfile';

const mockProduct: Product = {
  type: 'iap',
  productId: '0001',
  title: 'Mock',
  description: 'Mock',
  price: '0.99',
  currency: 'USD',
  localizedPrice: '0.99',
};

const mockPurchase: Purchase = {
  productId: '0001',
  transactionDate: 10101010,
  transactionReceipt: 'HASH_RECEIPT',
};

const mockAccountProfile = {
  accountAddress: '1234567890',
};

jest.mock('@rainbow-me/hooks', () => ({
  useAccountProfile: jest.fn(),
}));

jest.mock('react-native-iap', () => ({
  useIAP: jest.fn(),
}));

jest.mock('@cardstack/services', () => ({
  useProfilePurchasesMutation: jest.fn(() => [
    jest.fn(),
    {
      isSuccess: true,
      isError: false,
    },
  ]),
  hubApi: jest.fn(),
}));

describe('usePurchaseProfile', () => {
  const mockedGetProducts = jest.fn();
  const mockedGetPurchases = jest.fn();
  const mockedRequestPurchase = jest.fn();
  const mockedFinishTransaction = jest.fn();

  const mockUseIAP = (currentPurchase: Purchase | null = null) => {
    (useIAP as jest.Mock).mockImplementation(() => ({
      getProducts: mockedGetProducts.mockResolvedValue(mockProduct),
      getAvailablePurchases: mockedGetPurchases.mockResolvedValue(
        currentPurchase
      ),
      requestPurchase: mockedRequestPurchase.mockResolvedValue(null),
      finishTransaction: mockedFinishTransaction.mockResolvedValue(null),
      products: [mockProduct],
      currentPurchase: currentPurchase,
    }));
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    logger.sentry = jest.fn();
    logger.log = jest.fn();

    (useAccountProfile as jest.Mock).mockImplementation(
      () => mockAccountProfile
    );

    mockUseIAP();
  });

  it('should render usePurchaseProfile hook', async () => {
    const { result } = renderHook(() => usePurchaseProfile());

    expect(result.current).toBeDefined();
  });

  it('should have a profile attributes defined with the right account address', () => {
    const { result } = renderHook(() => usePurchaseProfile());

    expect(result.current.profileAttributes['owner-address']).toMatch(
      mockAccountProfile.accountAddress
    );
  });

  it('should have products available', () => {
    const { result } = renderHook(() => usePurchaseProfile());

    expect(result.current.products).toMatchObject([mockProduct]);
  });

  it('should request purchase when product purchase called', async () => {
    const { result, waitFor } = renderHook(() => usePurchaseProfile());

    await waitFor(() => {
      expect(mockedGetProducts).toHaveReturned();
    });

    await act(() => {
      result.current.purchaseProduct(mockProduct);
    });

    await waitFor(() => {
      expect(mockedRequestPurchase).toBeCalledWith(mockProduct.productId);
    });
  });

  it('should log product from getProducts call', async () => {
    const { waitFor } = renderHook(() => usePurchaseProfile());

    await waitFor(() => {
      expect(mockedGetProducts).toHaveReturned();
      expect(logger.log).toBeCalledWith('[IAP] Products response', mockProduct);
    });
  });

  it('should log null purchase from getAvailablePurchases call for default mock', async () => {
    const { waitFor } = renderHook(() => usePurchaseProfile());

    await waitFor(() => {
      expect(mockedGetPurchases).toHaveReturned();
      expect(logger.log).toBeCalledWith(
        '[IAP] Available Purchases response',
        null
      );
    });
  });

  it('should log mock purchase from getAvailablePurchases call', async () => {
    mockUseIAP(mockPurchase);

    const { waitFor } = renderHook(() => usePurchaseProfile());

    await waitFor(() => {
      expect(mockedGetPurchases).toHaveReturned();
      expect(logger.log).toBeCalledWith(
        '[IAP] Available Purchases response',
        mockPurchase
      );
    });
  });

  it('should have currentPurchase set to mockPurchase', async () => {
    mockUseIAP(mockPurchase);

    const { result, waitFor } = renderHook(() => usePurchaseProfile());

    await waitFor(() => {
      expect(mockedGetPurchases).toHaveReturned();
      expect(result.current.currentPurchase).toMatchObject(mockPurchase);
    });
  });

  it('should log error on sentry if product fetching fails', async () => {
    (useIAP as jest.Mock).mockImplementation(() => ({
      getProducts: mockedGetProducts.mockRejectedValueOnce('MOCK_ERROR'),
    }));

    const { waitFor } = renderHook(() => usePurchaseProfile());

    await waitFor(() => {
      expect(mockedGetProducts).toHaveReturned();
      expect(logger.sentry).toBeCalledWith(
        'Error fetching products:',
        'MOCK_ERROR'
      );
    });
  });

  it('should log error on sentry if purchases fetching fails', async () => {
    (useIAP as jest.Mock).mockImplementation(() => ({
      getAvailablePurchases: mockedGetPurchases.mockRejectedValueOnce(
        'MOCK_ERROR'
      ),
    }));

    const { waitFor } = renderHook(() => usePurchaseProfile());

    await waitFor(() => {
      expect(mockedGetPurchases).toHaveReturned();
      expect(logger.sentry).toBeCalledWith(
        'Error fetching available purchases:',
        'MOCK_ERROR'
      );
    });
  });

  it('should call validateReceiptCreateProfile to finish the IAP transaction after a successful purchase', async () => {
    mockUseIAP(mockPurchase);

    const { waitFor } = renderHook(() => usePurchaseProfile());

    await waitFor(() => {
      expect(mockedFinishTransaction).toBeCalled();
    });
  });
});

import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useIAP, Product, Purchase } from 'react-native-iap';

import { Routes as mockActualRoutes } from '@cardstack/navigation/routes';

import logger from 'logger';

import { useInitIAPProducts, usePurchaseProfile } from '../usePurchaseProfile';

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

jest.mock('react-native-iap', () => ({
  useIAP: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

const mockValidateReceipt = jest.fn();

jest.mock('@cardstack/services', () => ({
  useProfilePurchasesMutation: jest.fn(() => [
    mockValidateReceipt,
    {
      isSuccess: true,
      isError: false,
    },
  ]),
  hubApi: jest.fn(),
}));

jest.mock('@cardstack/navigation', () => ({
  Routes: mockActualRoutes,
  useLoadingOverlay: () => ({
    showLoadingOverlay: jest.fn(),
    dismissLoadingOverlay: jest.fn(),
  }),
}));

const profile = {
  slug: 'test',
  name: 'Test test',
  color: 'black',
  'text-color': 'white',
  'owner-address': '1234567',
};

describe('usePurchaseProfile', () => {
  const mockedGetProducts = jest.fn();
  const mockedRequestPurchase = jest.fn();
  const mockedFinishTransaction = jest.fn();

  const mockUseIAP = (currentPurchase: Purchase | null = null) => {
    (useIAP as jest.Mock).mockImplementation(() => ({
      getProducts: mockedGetProducts.mockResolvedValue(mockProduct),
      requestPurchase: mockedRequestPurchase.mockResolvedValue(null),
      finishTransaction: mockedFinishTransaction.mockResolvedValue(null),
      products: [mockProduct],
      currentPurchase,
    }));
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    logger.sentry = jest.fn();
    logger.log = jest.fn();

    mockUseIAP();
  });

  it('should render usePurchaseProfile hook', async () => {
    const { result } = renderHook(() => usePurchaseProfile(profile));

    expect(result.current).toBeDefined();
  });

  it('should have profileProduct available', () => {
    const { result } = renderHook(() => usePurchaseProfile(profile));

    expect(result.current.profileProduct).toMatchObject(mockProduct);
  });

  it('should request purchase when product purchase called', async () => {
    const { result } = renderHook(() => usePurchaseProfile(profile));

    act(() => {
      result.current.purchaseProfile();
    });

    await waitFor(() => {
      expect(mockedRequestPurchase).toBeCalledWith(mockProduct.productId);
    });
  });

  it('should getProducts on init call', async () => {
    renderHook(() => useInitIAPProducts());

    await waitFor(() => {
      expect(mockedGetProducts).toHaveBeenCalledWith(['0001']);
    });
  });

  it('should call validateReceipt when a currentPurchase is updated', async () => {
    mockUseIAP(mockPurchase);

    renderHook(() => usePurchaseProfile(profile));

    await waitFor(() => {
      expect(mockValidateReceipt).toBeCalledWith({
        iapReceipt: mockPurchase.transactionReceipt,
        provider: 'apple',
        profileInfo: profile,
      });
    });
  });

  it('should call mockedFinishTransaction to finish the IAP transaction after a successful purchase', async () => {
    mockUseIAP(mockPurchase);

    renderHook(() => usePurchaseProfile(profile));

    await waitFor(() => {
      expect(mockedFinishTransaction).toBeCalled();
    });
  });
});

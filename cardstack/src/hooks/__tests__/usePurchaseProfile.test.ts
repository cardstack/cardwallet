import { renderHook, act } from '@testing-library/react-native';
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
  logger.sentry = jest.fn();
  logger.log = jest.fn();

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

  beforeEach(() => {
    mockUseIAP();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have profileProduct available', () => {
    const { result } = renderHook(() => usePurchaseProfile(profile));

    expect(result.current.profileProduct).toEqual(mockProduct);
  });

  it('should getProducts on init call', () => {
    renderHook(() => useInitIAPProducts());

    expect(mockedGetProducts).toHaveBeenCalledWith(['0001']);
  });

  it('should request purchase when product purchase called', () => {
    const { result } = renderHook(() => usePurchaseProfile(profile));

    act(() => {
      result.current.purchaseProfile();
    });

    expect(mockedRequestPurchase).toBeCalledWith(mockProduct.productId);
  });

  it('should call validateReceipt when a currentPurchase is updated', () => {
    mockUseIAP(mockPurchase);

    renderHook(() => usePurchaseProfile(profile));

    expect(mockValidateReceipt).toBeCalledWith({
      iapReceipt: mockPurchase.transactionReceipt,
      provider: 'apple',
      profileInfo: profile,
    });
  });

  it('should call mockedFinishTransaction to finish the IAP transaction after a successful purchase', () => {
    mockUseIAP(mockPurchase);

    renderHook(() => usePurchaseProfile(profile));

    expect(mockedFinishTransaction).toBeCalled();
  });
});

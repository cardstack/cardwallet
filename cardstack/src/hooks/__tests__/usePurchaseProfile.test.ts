import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { useIAP, Product, Purchase } from 'react-native-iap';

// import { CreateBusinessInfoDIDParams } from '@cardstack/types';

import { useAccountProfile } from '@rainbow-me/hooks';

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

const mockedRequestPurchase = jest.fn().mockResolvedValue(true);
jest.mock('react-native-iap', () => ({
  useIAP: jest.fn(),
  requestPurchase: mockedRequestPurchase,
}));

const mockedLog = jest.fn();
jest.mock('logger', () => ({
  log: mockedLog,
}));

describe('usePurchaseProfile', () => {
  beforeEach(() => {
    (useAccountProfile as jest.Mock).mockImplementation(
      () => mockAccountProfile
    );

    (useIAP as jest.Mock).mockImplementation(() => ({
      getProducts: jest.fn().mockResolvedValue(mockProduct),
      getAvailablePurchases: jest.fn().mockResolvedValue(mockPurchase),
      products: [mockProduct],
    }));
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

  it('should log a response from getProducts call', () => {
    renderHook(() => usePurchaseProfile());

    waitFor(() => {
      expect(mockedLog).toHaveBeenLastCalledWith(`[IAP] Products response {
        type: 'iap',
        productId: '0001',
        title: 'Mock',
        description: 'Mock',
        price: '0.99',
        currency: 'USD',
        localizedPrice: '0.99'
      }`);
    });
  });

  it('should log a response from getAvailablePurchases call', () => {
    renderHook(() => usePurchaseProfile());

    waitFor(() => {
      expect(mockedLog)
        .toHaveBeenLastCalledWith(`[IAP] Available Purchases response {
          productId: '0001',
          transactionDate: 10101010,
          transactionReceipt: 'HASH_RECEIPT'
        }`);
    });
  });
});

import { act, renderHook } from '@testing-library/react-hooks';
import { Product, Purchase, useIAP } from 'react-native-iap';

import { useLazyValidateProfileSlugQuery } from '@cardstack/services';
import { ProfileIDUniquenessResponse } from '@cardstack/types';

import { strings } from '../strings';
import { useProfileSlugScreen } from '../useProfileSlugScreen';

const mockProduct: Product = {
  type: 'iap',
  productId: '0001',
  title: 'Mock',
  description: 'Mock',
  price: '0.99',
  currency: 'USD',
  localizedPrice: '0.99',
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

jest.mock('@cardstack/services', () => ({
  useLazyValidateProfileSlugQuery: jest.fn(),
}));

jest.mock('react-native-iap', () => ({
  useIAP: jest.fn(),
}));

describe('useProfileSlugScreen', () => {
  const mockLazyValidateProfileSlugQuery = (
    expectedResponse?: Partial<ProfileIDUniquenessResponse>,
    error?: any
  ) => {
    (useLazyValidateProfileSlugQuery as jest.Mock).mockImplementation(() => [
      jest.fn(),
      { data: expectedResponse, error },
    ]);
  };

  const mockedGetProducts = jest.fn();
  const mockedRequestPurchase = jest.fn();
  const mockedFinishTransaction = jest.fn();

  const mockUseIAP = (currentPurchase: Purchase | null = null) => {
    (useIAP as jest.Mock).mockImplementation(() => ({
      getProducts: mockedGetProducts.mockResolvedValue(mockProduct),
      requestPurchase: mockedRequestPurchase.mockResolvedValue(null),
      finishTransaction: mockedFinishTransaction.mockResolvedValue(null),
      products: [mockProduct],
      currentPurchase: currentPurchase,
    }));
  };

  beforeEach(() => {
    mockLazyValidateProfileSlugQuery({
      slugAvailable: false,
      detail: '',
    });

    mockUseIAP();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid assertion for good slug', async () => {
    mockLazyValidateProfileSlugQuery({
      slugAvailable: true,
    });

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('agoodslug'));

    expect(result.current.slugValidation.slugAvailable).toBeTruthy();
  });

  it('should return a invalid assertion for already in use slugs', async () => {
    mockLazyValidateProfileSlugQuery({
      slugAvailable: false,
    });

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('alreadyinuseslug'));

    expect(result.current.slugValidation.slugAvailable).toBeFalsy();
  });

  it('should return noApiResponse when request errors out', async () => {
    mockLazyValidateProfileSlugQuery(undefined, {});

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('apierror'));

    expect(result.current.slugValidation).toStrictEqual({
      slugAvailable: false,
      detail: strings.errors.noApiResponse,
    });
  });

  it('should return an invalid assertion for slugs too short', async () => {
    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('slu'));

    expect(result.current.slugValidation).toStrictEqual({
      slugAvailable: false,
      detail: 'ID must be at least 4 characters long',
    });
  });

  it('should return an invalid assertion for bad slugs', async () => {
    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('b@dslug'));

    expect(result.current.slugValidation).toStrictEqual({
      slugAvailable: false,
      detail:
        'Unique ID can only contain lowercase letters or numbers, no special characters',
    });
  });

  it('should return an invalid assertion for slugs with Uppercase letters', async () => {
    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('Badslug'));

    expect(result.current.slugValidation).toStrictEqual({
      slugAvailable: false,
      detail:
        'Unique ID can only contain lowercase letters or numbers, no special characters',
    });
  });

  it('should trim spaces from input', async () => {
    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange(' slug '));

    expect(result.current.slug).toMatch('slug');
  });
});

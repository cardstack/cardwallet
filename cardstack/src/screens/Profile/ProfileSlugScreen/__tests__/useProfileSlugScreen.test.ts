import { act, renderHook } from '@testing-library/react-native';
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
    error?: any,
    loadingInfo = { isLoading: false, isFetching: false }
  ) => {
    (useLazyValidateProfileSlugQuery as jest.Mock).mockImplementation(() => [
      jest.fn(),
      { data: expectedResponse, error, ...loadingInfo },
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

  it('should return valid assertion for good slug', () => {
    mockLazyValidateProfileSlugQuery({
      slugAvailable: true,
    });

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('agoodslug'));

    expect(result.current.slugValidation.slugAvailable).toBeTruthy();
  });

  it('should return a invalid assertion for already in use slugs', () => {
    mockLazyValidateProfileSlugQuery({
      slugAvailable: false,
    });

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('alreadyinuseslug'));

    expect(result.current.slugValidation.slugAvailable).toBeFalsy();
  });

  it('should return noApiResponse when request errors out', () => {
    mockLazyValidateProfileSlugQuery(undefined, {});

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('apierror'));

    expect(result.current.slugValidation).toStrictEqual({
      slugAvailable: false,
      detail: strings.errors.noApiResponse,
    });
  });

  it('should return an invalid assertion for slugs too short', () => {
    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('slu'));

    expect(result.current.slugValidation).toStrictEqual({
      slugAvailable: false,
      detail: 'ID must be at least 4 characters long',
    });
  });

  it('should return an invalid assertion for bad slugs', () => {
    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('b@dslug'));

    expect(result.current.slugValidation).toStrictEqual({
      slugAvailable: false,
      detail:
        'Unique ID can only contain lowercase letters or numbers, no special characters',
    });
  });

  it('should return an invalid assertion for slugs with Uppercase letters', () => {
    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('Badslug'));

    expect(result.current.slugValidation).toStrictEqual({
      slugAvailable: false,
      detail:
        'Unique ID can only contain lowercase letters or numbers, no special characters',
    });
  });

  it('should trim spaces from input', () => {
    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange(' slug '));

    expect(result.current.slug).toMatch('slug');
  });

  it('should block continue while hub validation is loading', () => {
    mockLazyValidateProfileSlugQuery(
      {
        slugAvailable: true,
      },
      undefined,
      { isLoading: true, isFetching: false }
    );

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('validslug'));

    expect(result.current.canContinue).toBe(false);
  });

  it('should block continue while hub validation is fetching', () => {
    mockLazyValidateProfileSlugQuery(
      {
        slugAvailable: true,
      },
      undefined,
      { isLoading: false, isFetching: true }
    );

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('validslug'));

    expect(result.current.canContinue).toBe(false);
  });

  it('should unblock continue once hubValidation has returned', () => {
    mockLazyValidateProfileSlugQuery(
      {
        slugAvailable: true,
      },
      undefined,
      { isLoading: false, isFetching: false }
    );

    const { result } = renderHook(() => useProfileSlugScreen());

    act(() => result.current.onSlugChange('validslug'));

    expect(result.current.canContinue).toBe(true);
  });
});

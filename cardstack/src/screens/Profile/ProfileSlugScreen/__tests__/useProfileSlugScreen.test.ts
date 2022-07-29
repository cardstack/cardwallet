import { act, renderHook } from '@testing-library/react-hooks';

import { useLazyValidateProfileSlugQuery } from '@cardstack/services';
import { BusinessIDUniquenessResponse } from '@cardstack/types';

import { strings } from '../strings';
import { useProfileSlugScreen } from '../useProfileSlugScreen';

jest.mock('@cardstack/services', () => ({
  useLazyValidateProfileSlugQuery: jest.fn(),
}));

describe('useProfileSlugScreen', () => {
  const mockLazyValidateProfileSlugQuery = (
    expectedResponse?: Partial<BusinessIDUniquenessResponse>,
    error?: any
  ) => {
    (useLazyValidateProfileSlugQuery as jest.Mock).mockImplementation(() => [
      jest.fn(),
      { data: expectedResponse, error },
    ]);
  };

  beforeEach(() => {
    mockLazyValidateProfileSlugQuery({
      slugAvailable: false,
      detail: '',
    });
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

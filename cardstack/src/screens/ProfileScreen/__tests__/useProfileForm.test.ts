import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { exampleMerchantData, strings } from '../components';
import { useProfileForm } from '../useProfileForm';
import { useAccountProfile } from '@rainbow-me/hooks';
import { checkBusinessIdUniqueness } from '@cardstack/services/hub-service';

jest.mock('@rainbow-me/hooks', () => ({
  useAccountProfile: jest.fn(),
}));

jest.mock('@cardstack/services/hub-service', () => ({
  checkBusinessIdUniqueness: jest.fn(() => ({ slugAvailable: false })),
}));

jest.mock('@cardstack/hooks/prepaid-card/useAuthToken', () => ({
  useAuthToken: () => ({
    authToken: '123',
    isLoading: false,
  }),
}));

describe('useProfileForm', () => {
  beforeEach(() => {
    (useAccountProfile as jest.Mock).mockImplementation(() => ({
      accountAddress: '1234567890',
      accountName: 'foo',
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should useProfileForm return empty businessName, avatarName with default,isUniqueId at initial render', async () => {
    const { result } = renderHook(() => useProfileForm());

    expect(result.current.businessName).toBe('');
    expect(result.current.isUniqueId).toBe(false);
    expect(result.current.avatarName).toBe(
      exampleMerchantData.merchantInfo.name
    );

    expect(result.current.errors).toBe(undefined);
  });

  it('should useProfileForm return error with empty businessName or businessId', () => {
    const { result } = renderHook(() => useProfileForm());

    act(() => {
      result.current.onSubmitForm();
    });

    expect(result.current.errors?.businessName).toBe(
      strings.businessNameRequired
    );

    expect(result.current.errors?.businessId).toBe(
      strings.businessIdShouldBeUnique
    );
  });

  it('should useProfileForm return updated values', () => {
    const { result } = renderHook(() => useProfileForm());
    const businessName = 'foo';
    const businessId = 'bar';
    act(() => {
      result.current.onChangeBusinessName({
        nativeEvent: { text: businessName },
      });
    });

    act(() => {
      result.current.onChangeBusinessId({
        nativeEvent: { text: businessId },
      });
    });

    expect(result.current?.businessName).toBe(businessName);
    expect(result.current?.avatarName).toBe(businessName);

    expect(result.current?.businessId).toBe(businessId);
  });

  it('should useProfileForm return errors undefined when not submitted yet', () => {
    const { result } = renderHook(() => useProfileForm());

    expect(result.current?.errors).toBe(undefined);
  });

  it('should useProfileForm return no error if unique id and valid businessName', async () => {
    (checkBusinessIdUniqueness as jest.Mock).mockImplementation(() => ({
      slugAvailable: true,
      detail: '',
    }));

    const { result } = renderHook(() => useProfileForm());
    const businessId = 'bar';

    act(() => {
      result.current.onChangeBusinessId({
        nativeEvent: { text: businessId },
      });
    });

    await waitFor(() => expect(result.current.isUniqueId).toEqual(true));

    expect(result.current?.errors?.businessId).toBe(undefined);
    expect(result.current?.errors?.businessName).toBe(undefined);
  });
});

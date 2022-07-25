import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import { DEPRECATED_checkBusinessIdUniqueness } from '@cardstack/services/hub-service';

import { useAccountProfile } from '@rainbow-me/hooks';

import { exampleMerchantData, strings } from '../components';
import { useProfileForm } from '../useProfileForm';

jest.mock('@rainbow-me/hooks', () => ({
  useAccountProfile: jest.fn(),
  useAccountSettings: () => ({
    accountAddress: '0x0000000000000000000',
    nativeCurrency: 'USD',
    network: 'sokol',
  }),
  useWallets: () => ({ selectedWallet: { id: 'fooSelectedWallet' } }),
}));

jest.mock('@cardstack/services/hub-service', () => ({
  DEPRECATED_checkBusinessIdUniqueness: jest.fn(() => ({
    slugAvailable: false,
  })),
}));

jest.mock('@cardstack/hooks/prepaid-card/useAuthToken', () => ({
  useAuthToken: () => ({
    authToken: '123',
    isLoading: false,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

jest.mock('@cardstack/notification-handler', () => ({
  displayLocalNotification: jest.fn(),
}));

jest.mock('@cardstack/services', () => ({
  useCreateProfileMutation: jest.fn(() => [
    jest.fn(),
    {
      isSuccess: true,
      isError: false,
    },
  ]),
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

  it('should return empty businessName, avatarName with default,isUniqueId at initial render', async () => {
    const { result } = renderHook(() => useProfileForm());

    expect(result.current.businessName).toBe('');
    expect(result.current.isUniqueId).toBe(false);
    expect(result.current.avatarName).toBe(
      exampleMerchantData.merchantInfo.name
    );

    expect(result.current.errors).toBe(undefined);
  });

  it('should return error with empty businessName or businessId', () => {
    const { result } = renderHook(() => useProfileForm());
    const invalidMerchantIdAssertion = validateMerchantId('');

    act(() => {
      result.current.onSubmitForm();
    });

    expect(result.current.errors?.businessName).toBe(
      strings.validation.thisFieldIsRequied
    );

    expect(result.current.errors?.businessId).toBe(invalidMerchantIdAssertion);
  });

  it('should return updated values', () => {
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

  it('should return errors undefined when not submitted yet', () => {
    const { result } = renderHook(() => useProfileForm());

    expect(result.current?.errors).toBe(undefined);
  });

  it('should return error if profileId length is less than 4 characters', async () => {
    (DEPRECATED_checkBusinessIdUniqueness as jest.Mock).mockImplementation(
      () => ({
        slugAvailable: true,
        detail: '',
      })
    );

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

    act(() => {
      result.current.onSubmitForm();
    });

    expect(result.current?.businessId).toBe(businessId);

    await waitFor(() => expect(result.current.errors).not.toEqual(undefined));

    expect(result.current?.errors?.businessId).toBe(
      strings.validation.profileIdLengthError
    );
  });

  it('should return no error if unique id and valid businessName', async () => {
    (DEPRECATED_checkBusinessIdUniqueness as jest.Mock).mockImplementation(
      () => ({
        slugAvailable: true,
        detail: '',
      })
    );

    const { result } = renderHook(() => useProfileForm());
    const businessId = 'bar1';

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

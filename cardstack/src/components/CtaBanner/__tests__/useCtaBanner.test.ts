import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import { useCtaBanner } from '@cardstack/components';
import { SHOW_CTA_BANNER_KEY } from '@cardstack/utils';

const TEST_KEY = 'TEST_KEY';

describe('useCtaBanner', () => {
  beforeEach(() => {
    AsyncStorage.getItem = jest.fn().mockResolvedValue(undefined);
    AsyncStorage.setItem = jest.fn().mockResolvedValue(null);
  });

  afterEach(() => jest.clearAllMocks());

  it('should have showBanner true as default', async () => {
    const { result } = renderHook(() => useCtaBanner(TEST_KEY));

    await waitFor(() => expect(result.current.showBanner).toEqual(true));
  });

  it('should try to get storage item on initial render', async () => {
    renderHook(() => useCtaBanner(TEST_KEY));

    const getItemSpy = jest.spyOn(AsyncStorage, 'getItem');

    await waitFor(() => expect(getItemSpy).toBeCalledTimes(1));

    expect(getItemSpy).toBeCalledWith(SHOW_CTA_BANNER_KEY + TEST_KEY);
  });

  it('should have showBanner as false if its stored in asyncStorage', async () => {
    AsyncStorage.getItem = jest.fn().mockResolvedValue('false');

    const { result } = renderHook(() => useCtaBanner(TEST_KEY));

    await waitFor(() => expect(result.current.showBanner).toEqual(false));
  });

  it('should set showBanner to false on dismissBanner', async () => {
    const setItemSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useCtaBanner(TEST_KEY));

    act(() => result.current.dismissBanner());

    await waitFor(() => expect(setItemSpy).toBeCalledTimes(1));

    expect(setItemSpy).toBeCalledWith(SHOW_CTA_BANNER_KEY + TEST_KEY, 'false');
    expect(result.current.showBanner).toEqual(false);
  });
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';

import { SettingsExternalURLs } from '@cardstack/constants';

import { useCtaBanner } from '../useCtaBanner';

describe('useCtaBanner', () => {
  beforeEach(() => {
    AsyncStorage.getItem = jest.fn().mockResolvedValue(undefined);
    AsyncStorage.setItem = jest.fn().mockResolvedValue(null);
  });

  afterEach(() => jest.clearAllMocks());

  it('should have showPromoBanner true as default', async () => {
    const { result } = renderHook(() => useCtaBanner());

    await waitFor(() => expect(result.current.showPromoBanner).toEqual(true));
  });

  it('should try to get storage item on initial render', async () => {
    renderHook(() => useCtaBanner());

    const getItemSpy = jest.spyOn(AsyncStorage, 'getItem');

    await waitFor(() => expect(getItemSpy).toBeCalledTimes(1));

    expect(getItemSpy).toBeCalledWith('showPromoBannerKey');
  });

  it('should have showPromoBanner as false if its stored in asyncStorage', async () => {
    AsyncStorage.getItem = jest.fn().mockResolvedValue('false');

    const { result } = renderHook(() => useCtaBanner());

    await waitFor(() => expect(result.current.showPromoBanner).toEqual(false));
  });

  it('should set showPromoBanner to false onPress', async () => {
    const setItemSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useCtaBanner());

    act(() => result.current.onPress());

    await waitFor(() => expect(setItemSpy).toBeCalledTimes(1));

    expect(setItemSpy).toBeCalledWith('showPromoBannerKey', 'false');
    expect(result.current.showPromoBanner).toEqual(false);
  });

  it('should open discord URL onPress', async () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL');

    const { result } = renderHook(() => useCtaBanner());

    act(() => result.current.onPress());

    await waitFor(() => expect(result.current.showPromoBanner).toEqual(false));

    expect(openURLSpy).toBeCalledWith(SettingsExternalURLs.discordInviteLink);
  });
});

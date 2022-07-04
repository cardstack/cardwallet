import { renderHook } from '@testing-library/react-hooks';
import { waitFor, act } from '@testing-library/react-native';
import { AppState } from 'react-native';

import { useAppState } from '../../../../src/hooks/useAppState';

const FIRST_OPEN = {
  appState: 'active',
  justBecameActive: undefined,
  movedFromBackground: false,
  isInBackground: false,
  isActive: true,
};

const BACKGROUND = {
  appState: 'background',
  justBecameActive: false,
  movedFromBackground: false,
  isInBackground: true,
  isActive: false,
};

const SECOND_OPEN = {
  appState: 'active',
  justBecameActive: true,
  movedFromBackground: true,
  isInBackground: false,
  isActive: true,
};

describe('useAppState', () => {
  it('should match values for first open state', async () => {
    const { result } = renderHook(() => useAppState());
    const appStateSpy = jest.spyOn(AppState, 'addEventListener');

    await act(async () => {
      await appStateSpy.mock.calls[0][1]('active');
    });

    await waitFor(() => {
      expect(result.current).toEqual(FIRST_OPEN);
    });

    appStateSpy.mockClear();
  });

  it('should match values for background if state changes to background', async () => {
    const { result } = renderHook(() => useAppState());
    const appStateSpy = jest.spyOn(AppState, 'addEventListener');

    await act(async () => {
      await appStateSpy.mock.calls[0][1]('background');
    });

    await waitFor(() => {
      expect(result.current).toEqual(BACKGROUND);
    });

    appStateSpy.mockClear();
  });

  it('should match values for second open if state changes from background to active', async () => {
    const { result } = renderHook(() => useAppState());
    const appStateSpy = jest.spyOn(AppState, 'addEventListener');

    await act(async () => {
      await appStateSpy.mock.calls[0][1]('background');
      await appStateSpy.mock.calls[0][1]('active');
    });

    await waitFor(() => {
      expect(result.current).toEqual(SECOND_OPEN);
    });

    appStateSpy.mockClear();
  });
});

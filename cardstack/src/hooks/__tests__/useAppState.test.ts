import { renderHook, waitFor, act } from '@testing-library/react-native';
import { AppState } from 'react-native';

import { useAppState } from '../useAppState';

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
  const appStateSpy = jest.spyOn(AppState, 'addEventListener');

  const mockAppState = (state: 'active' | 'background') => {
    appStateSpy.mock.calls[0][1](state);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match values for first open state', async () => {
    const { result } = renderHook(() => useAppState());

    await act(async () => {
      await mockAppState('active');
    });

    await waitFor(() => {
      expect(result.current).toEqual(FIRST_OPEN);
    });
  });

  it('should match values for background if state changes to background', async () => {
    const { result } = renderHook(() => useAppState());

    await act(async () => {
      await mockAppState('background');
    });

    await waitFor(() => {
      expect(result.current).toEqual(BACKGROUND);
    });
  });

  it('should match values for second open if state changes from background to active', async () => {
    const { result } = renderHook(() => useAppState());

    await act(async () => {
      await mockAppState('background');
      await mockAppState('active');
    });

    await waitFor(() => {
      expect(result.current).toEqual(SECOND_OPEN);
    });
  });
});

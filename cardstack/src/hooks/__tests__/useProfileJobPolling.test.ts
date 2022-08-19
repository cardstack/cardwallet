import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';

import {
  useGetProfileJobStatusQuery,
  usePostProfileJobRetryMutation,
} from '@cardstack/services';

import { useProfileJobPolling } from '../useProfileJobPolling';

jest.mock('@cardstack/services', () => ({
  useGetProfileJobStatusQuery: jest.fn(),
  usePostProfileJobRetryMutation: jest.fn(),
}));

const mockJobParams = { jobID: 'ANY', onJobCompletedCallback: jest.fn() };

const mockJobRetryMutation = jest.fn();

describe('useProfileJobPolling', () => {
  const mockUseGetProfileJobStatusQuery = (
    state: 'pending' | 'success' | 'failed' = 'pending',
    error?: any
  ) => {
    (useGetProfileJobStatusQuery as jest.Mock).mockImplementation(() => ({
      data: {
        attributes: {
          state,
        },
      },
      error,
    }));
  };

  // Once isSuccess is true, polling restarts.
  const mockUsePostProfileJobRetryMutation = (isSuccess = false) => {
    (usePostProfileJobRetryMutation as jest.Mock).mockImplementation(() => [
      mockJobRetryMutation,
      { isSuccess },
    ]);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockUseGetProfileJobStatusQuery();
    mockUsePostProfileJobRetryMutation();
  });

  it('should start hook waiting when jobID not provided', () => {
    const { result } = renderHook(() =>
      useProfileJobPolling({ ...mockJobParams, jobID: undefined })
    );

    expect(result.current.isCreatingProfile).toBeFalsy();
  });

  it('should start hook polling when jobID provided', () => {
    const { result } = renderHook(() => useProfileJobPolling(mockJobParams));

    expect(result.current.isCreatingProfile).toBeTruthy();
  });

  it('should stop polling with no errors on profile success', () => {
    const { result, rerender } = renderHook(() =>
      useProfileJobPolling(mockJobParams)
    );

    mockUseGetProfileJobStatusQuery('success');
    rerender();

    expect(result.current.isCreatingProfile).toBeFalsy();
  });

  it('should return profile error flag on job has failed', () => {
    const { result, rerender } = renderHook(() =>
      useProfileJobPolling(mockJobParams)
    );

    mockUseGetProfileJobStatusQuery('failed');
    rerender();

    expect(result.current.isCreateProfileError).toBeTruthy();
  });

  it('should be able to call retry function if job has failed', () => {
    const { result, rerender } = renderHook(() =>
      useProfileJobPolling(mockJobParams)
    );

    mockUseGetProfileJobStatusQuery('failed');
    rerender();

    act(() => {
      result.current.retryCurrentCreateProfile();
    });

    expect(mockJobRetryMutation).toBeCalled();
  });

  it('should resume polling once retry call is successful', () => {
    const { result, rerender } = renderHook(() =>
      useProfileJobPolling(mockJobParams)
    );

    mockUseGetProfileJobStatusQuery('failed');
    rerender();

    expect(result.current.isCreatingProfile).toBeFalsy();

    mockUsePostProfileJobRetryMutation(true);
    rerender();

    expect(result.current.isCreatingProfile).toBeTruthy();
  });
});

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useCallback, useEffect, useMemo } from 'react';

import { useMutationEffects } from '@cardstack/hooks';
import {
  useGetProfileJobStatusQuery,
  usePostProfileJobRetryMutation,
} from '@cardstack/services';

import { useBooleanState } from './useBooleanState';

const JOB_POLLING_INTERVAL = 5000;

interface ProfileJobPollingProps {
  jobID?: string;
  onJobCompletedCallback: (
    error?: FetchBaseQueryError | SerializedError
  ) => void;
}

/**
 * useProfileJobPolling
 * Profile creation job takes time to complete.
 * This hook keeps pooling until the profile is ready.
 */
export const useProfileJobPolling = ({
  jobID = '',
  onJobCompletedCallback,
}: ProfileJobPollingProps) => {
  const [polling, startPolling, stopPolling] = useBooleanState(!!jobID);

  const { data, error } = useGetProfileJobStatusQuery(
    { jobTicketID: jobID },
    {
      pollingInterval: JOB_POLLING_INTERVAL,
      skip: !jobID || !polling,
    }
  );

  const jobState = useMemo(() => data?.attributes?.state, [data]);

  useEffect(() => {
    if (jobID) {
      startPolling();
    }
  }, [jobID, startPolling]);

  useEffect(() => {
    if (jobState === 'success' || error) {
      stopPolling();
      onJobCompletedCallback(error);
    }

    if (jobState === 'failed') {
      stopPolling();
    }
  }, [jobState, error, stopPolling, onJobCompletedCallback]);

  // Handling profile creation job "failed" state.
  // API connection errors need to be handled separetedly, or we risk retrying an ongoing job.
  const [retryJobID, { isSuccess }] = usePostProfileJobRetryMutation();

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isSuccess,
          callback: startPolling,
        },
      }),
      [startPolling, isSuccess]
    )
  );

  const retryCurrentCreateProfile = useCallback(() => {
    if (jobState === 'failed') {
      retryJobID({ jobTicketID: jobID });
    }
  }, [retryJobID, jobID, jobState]);

  return {
    isConnectionError: error,
    isCreatingProfile: polling,
    isCreateProfileError: jobState === 'failed',
    retryCurrentCreateProfile,
  };
};

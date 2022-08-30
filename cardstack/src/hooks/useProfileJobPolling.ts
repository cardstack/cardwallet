import { useCallback, useEffect, useMemo } from 'react';

import { useMutationEffects } from '@cardstack/hooks';
import {
  useGetProfileJobStatusQuery,
  usePostProfileJobRetryMutation,
} from '@cardstack/services';
import { parseRTKConnectionError } from '@cardstack/services/utils';

import { useBooleanState } from './useBooleanState';

const JOB_POLLING_INTERVAL = 5000;

interface ProfileJobPollingProps {
  jobID?: string;
}

/**
 * useProfileJobPolling
 * Profile creation job takes time to complete.
 * This hook keeps pooling until the profile is ready.
 */
export const useProfileJobPolling = ({
  jobID = '',
}: ProfileJobPollingProps) => {
  const [polling, startPolling, stopPolling] = useBooleanState(!!jobID);

  const { data: jobState = 'pending', error } = useGetProfileJobStatusQuery(
    { jobTicketID: jobID },
    {
      pollingInterval: JOB_POLLING_INTERVAL,
      skip: !jobID || !polling,
    }
  );

  const isFailedJob = useMemo(() => jobState === 'failed', [jobState]);

  useEffect(() => {
    if (jobID) {
      startPolling();
    }
  }, [jobID, startPolling]);

  useEffect(() => {
    if (jobState !== 'pending' || error) {
      stopPolling();
    }
  }, [jobState, error, stopPolling]);

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
    if (isFailedJob) {
      retryJobID({ jobTicketID: jobID });
    }
  }, [isFailedJob, retryJobID, jobID]);

  return {
    connectionError: parseRTKConnectionError(error),
    isCreatingProfile: polling,
    isCreateProfileError: isFailedJob,
    retryCurrentCreateProfile,
  };
};

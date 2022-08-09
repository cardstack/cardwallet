import { useEffect, useMemo } from 'react';

import { useGetProfileJobStatusQuery } from '@cardstack/services';

import { useBooleanState } from './useBooleanState';

const JOB_POLLING_INTERVAL = 5000;

interface ProfileJobPollingProps {
  jobID?: string;
  onJobCompletedCallback: (
    error?: FetchBaseQueryError | SerializedError | undefined
  ) => void;
}

/**
 * useProfileJobPolling
 * Profile creation job takes time to complete.
 * This hook keeps pooling until the profile is ready.
 */
export const useProfileJobPolling = ({
  jobID,
  onJobCompletedCallback,
}: ProfileJobPollingProps) => {
  const [polling, startPolling, stopPolling] = useBooleanState();

  const { data, error } = useGetProfileJobStatusQuery(
    { jobTicketID: jobID || '' },
    {
      pollingInterval: polling ? JOB_POLLING_INTERVAL : undefined,
      skip: !jobID,
    }
  );

  const isCreatingProfile = useMemo(
    () => data?.attributes?.state === 'pending',
    [data]
  );

  useEffect(() => {
    if (jobID) {
      startPolling();
    }
  }, [jobID, startPolling]);

  useEffect(() => {
    if (data?.attributes?.state === 'success' || error) {
      stopPolling();
      onJobCompletedCallback(error);
    }
  }, [data, error, stopPolling, onJobCompletedCallback]);

  return {
    isCreatingProfile,
  };
};

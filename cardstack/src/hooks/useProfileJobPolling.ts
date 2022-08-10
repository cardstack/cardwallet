import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useEffect } from 'react';

import { useGetProfileJobStatusQuery } from '@cardstack/services';

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
    isCreatingProfile: polling,
  };
};

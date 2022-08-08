import { useEffect, useMemo } from 'react';

import { useGetProfileJobStatusQuery } from '@cardstack/services';

import { useBooleanState } from './useBooleanState';

const JOB_POLLING_INTERVAL = 5000;

export const useProfileJobPolling = (jobID?: string) => {
  const [polling, startPolling, stopPolling] = useBooleanState();

  // Profile creation job takes time to complete, this hook keeps pooling until the profile is ready.
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
    }
  }, [data, error, stopPolling]);

  return {
    data,
    error,
    isCreatingProfile,
  };
};

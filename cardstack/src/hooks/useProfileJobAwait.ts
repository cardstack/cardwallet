import { useCallback, useState, useEffect } from 'react';

import { useLazyCreateProfileJobQuery } from '@cardstack/services';

const JOB_POLLING_INTERVAL = 5000;

export const useProfileJobAwait = () => {
  const [pollingState, setPollingState] = useState({
    shouldStartPolling: false,
    isSafesRefreshNeeded: false,
  });

  const [
    jobQuery,
    { data: profileSafeId, error },
  ] = useLazyCreateProfileJobQuery({
    pollingInterval: pollingState.shouldStartPolling
      ? JOB_POLLING_INTERVAL
      : undefined,
  });

  const handleAwaitForProfileCreation = useCallback(
    (accountAddress: string) => {
      setPollingState({
        shouldStartPolling: true,
        isSafesRefreshNeeded: false,
      });

      jobQuery({ eoa: accountAddress });
    },
    [setPollingState, jobQuery]
  );

  useEffect(() => {
    if (profileSafeId || error) {
      setPollingState({
        shouldStartPolling: false,
        isSafesRefreshNeeded: true,
      });
    }
  }, [profileSafeId, error]);

  return {
    ...pollingState,
    handleAwaitForProfileCreation,
    profileSafeId,
    error,
  };
};

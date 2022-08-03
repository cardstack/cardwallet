import { useCallback, useState, useEffect } from 'react';

import { useLazyCreateProfileJobQuery } from '@cardstack/services';

const JOB_POLLING_INTERVAL = 5000;

export const useProfileJobAwait = () => {
  const [triggerPolling, setTriggerPolling] = useState(false);

  const [
    jobQuery,
    { data: profileSafeId, error },
  ] = useLazyCreateProfileJobQuery({
    pollingInterval: triggerPolling ? JOB_POLLING_INTERVAL : undefined,
  });

  const handleAwaitForProfileCreation = useCallback(
    async jobTicketId => {
      setTriggerPolling(true);
      jobQuery({ jobTicketId });
    },
    [jobQuery, setTriggerPolling]
  );

  useEffect(() => {
    if (profileSafeId || error) {
      setTriggerPolling(false);
    }
  }, [profileSafeId, error]);

  return {
    handleAwaitForProfileCreation,
    profileSafeId,
    error,
  };
};

import { reverse, sortBy, values } from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function useRequests() {
  const { requests } = useSelector(({ requests: stateRequests }) => ({
    requests: stateRequests.requests,
  }));

  const { pendingRequestCount, sortedRequests } = useMemo(() => {
    const sorted = reverse(
      sortBy(values(requests), 'displayDetails.timestampInMs')
    );

    return {
      pendingRequestCount: sorted.length,
      sortedRequests: sorted,
    };
  }, [requests]);

  return {
    pendingRequestCount,
    requests: sortedRequests,
    latestRequest: sortedRequests?.[0],
  };
}

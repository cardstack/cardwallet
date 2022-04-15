import { useRef, useMemo, useEffect } from 'react';

import { useAccountProfile } from '@rainbow-me/hooks';

/**
 * This hook is helper for switching account states,
 * where the initial loading UI behavior
 * is expected even when the query is refetched
 */
export const useIsFetchingDataNewAccount = (isFetching: boolean) => {
  const { accountAddress } = useAccountProfile();

  const prevAccount = useRef(accountAddress);

  // Account was switched but data is refreshing
  const isFetchingDataNewAccount = useMemo(
    () => isFetching && prevAccount.current !== accountAddress,
    [accountAddress, isFetching, prevAccount]
  );

  useEffect(() => {
    if (isFetchingDataNewAccount) {
      prevAccount.current = accountAddress;
    }
  }, [accountAddress, isFetchingDataNewAccount]);

  return isFetchingDataNewAccount;
};

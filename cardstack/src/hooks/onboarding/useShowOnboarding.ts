import { useCallback } from 'react';

import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { remoteFlags } from '@cardstack/services/remote-config';

export const useShowOnboarding = () => {
  const {
    primarySafe,
    isFetching,
    isLoading,
    isUninitialized,
  } = usePrimarySafe();

  // Using a callback instead of memo to pull the feature flag value on call.
  // That is because the flag is stateles and does not causes react's side-effects,
  // so it will not update the memo value.
  const shouldPresentOnboarding = useCallback(() => {
    return (
      !(isLoading && isFetching && primarySafe && isUninitialized) &&
      remoteFlags().featureProfilePurchaseOnboarding
    );
  }, [isLoading, isFetching, primarySafe, isUninitialized]);

  return {
    shouldPresentOnboarding,
  };
};

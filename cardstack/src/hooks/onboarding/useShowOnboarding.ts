import { useCallback } from 'react';

import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { remoteFlags } from '@cardstack/services/remote-config';

export const useShowOnboarding = () => {
  const { primarySafe, isFetching, isLoading } = usePrimarySafe();

  // Using a callback instead of memo to force pull the feature remote flag value on call.
  // That is because it's a value inside react's side-effects and will not update a memo value.
  const shouldPresentOnboarding = useCallback(() => {
    return (
      !isLoading &&
      !isFetching &&
      !primarySafe &&
      remoteFlags().featureProfilePurchaseOnboarding
    );
  }, [isLoading, isFetching, primarySafe]);

  return {
    shouldPresentOnboarding,
  };
};

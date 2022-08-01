import { useCallback } from 'react';

import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { remoteFlags } from '@cardstack/services/remote-config';

export const useShowOnboarding = () => {
  const { primarySafe, isFetching, isLoading } = usePrimarySafe();

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

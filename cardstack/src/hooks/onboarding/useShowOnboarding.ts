import { useCallback } from 'react';

import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { remoteFlags } from '@cardstack/services/remote-config';

export const useShowOnboarding = () => {
  const { primarySafe, isFetching } = usePrimarySafe();

  const shouldPresentOnboarding = useCallback(() => {
    return (
      !isFetching &&
      !primarySafe &&
      remoteFlags().featureProfilePurchaseOnboarding
    );
  }, [isFetching, primarySafe]);

  return {
    shouldPresentOnboarding,
  };
};

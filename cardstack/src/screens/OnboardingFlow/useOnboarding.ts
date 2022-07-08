import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Routes } from '@cardstack/navigation';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

export const useOnboarding = () => {
  const { navigate } = useNavigation();
  const { primarySafe, isFetching } = usePrimarySafe();

  const showOnboarding = useCallback(() => {
    if (!isFetching && !primarySafe) {
      navigate(Routes.PROFILE_SLUG_SCREEN);

      return true;
    }

    return false;
  }, [primarySafe, isFetching, navigate]);

  return {
    showOnboarding,
  };
};

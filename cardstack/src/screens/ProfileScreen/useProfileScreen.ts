import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';

import {
  useIsFetchingDataNewAccount,
  useProfileJobPolling,
} from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

import { useAccountSettings } from '@rainbow-me/hooks';
import { SettingsPages } from '@rainbow-me/screens/SettingsModal';

type ProfileScreenParamsType = RouteType<{
  profileCreationJobID?: string;
}>;

export const useProfileScreen = () => {
  const { navigate } = useNavigation();
  const { params } = useRoute<ProfileScreenParamsType>();

  const {
    primarySafe,
    isFetching,
    refetch,
    safesCount,
    isLoading,
    isUninitialized,
  } = usePrimarySafe();

  // Profile creation job takes time to complete, this hook keeps pooling until the profile is ready.
  const { data, error } = useProfileJobPolling(params?.profileCreationJobID);

  const { network } = useAccountSettings();

  const isRefreshingForNewAccount = useIsFetchingDataNewAccount(isFetching);

  const showLoading = useMemo(
    () =>
      isLoading ||
      isUninitialized ||
      isRefreshingForNewAccount ||
      (isFetching && !primarySafe),
    [
      isFetching,
      isLoading,
      isRefreshingForNewAccount,
      isUninitialized,
      primarySafe,
    ]
  );

  const redirectToSwitchNetwork = useCallback(() => {
    navigate(Routes.SETTINGS_MODAL, {
      initialRoute: SettingsPages.network.key,
    });
  }, [navigate]);

  const showCreatingProfile = useMemo(
    () => data?.attributes?.state === 'pending',
    [data]
  );

  // When the new profile is done, we need to refresh the safes list.
  useEffect(() => {
    if (data?.attributes?.state === 'success') {
      // Once pooling is done, we need to refresh safes.
      refetch();
    }
  }, [data, refetch]);

  return {
    primarySafe,
    showLoading,
    showCreatingProfile,
    error,
    safesCount,
    network,
    isFetching,
    refetch,
    redirectToSwitchNetwork,
  };
};

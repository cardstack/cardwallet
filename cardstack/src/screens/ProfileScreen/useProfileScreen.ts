import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import {
  useIsFetchingDataNewAccount,
  useProfileJobPolling,
} from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { useGetProfileUnfulfilledJobQuery } from '@cardstack/services';

import { useAccountSettings } from '@rainbow-me/hooks';

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
    hasProfile,
  } = usePrimarySafe();

  const {
    data: pendingJobId,
    isLoading: isLoadingProfileJobs,
  } = useGetProfileUnfulfilledJobQuery(undefined, {
    skip: isLoading || isUninitialized || hasProfile,
  });

  const {
    isConnectionError,
    isCreatingProfile,
    isCreateProfileError,
    retryCurrentCreateProfile,
  } = useProfileJobPolling({
    jobID: params?.profileCreationJobID || pendingJobId,
  });

  const { network } = useAccountSettings();

  const isRefreshingForNewAccount = useIsFetchingDataNewAccount(isFetching);

  const showLoading = useMemo(
    () =>
      isLoading ||
      isUninitialized ||
      isRefreshingForNewAccount ||
      isCreatingProfile ||
      isLoadingProfileJobs ||
      (isFetching && !primarySafe),
    [
      isLoading,
      isUninitialized,
      isRefreshingForNewAccount,
      isCreatingProfile,
      isLoadingProfileJobs,
      isFetching,
      primarySafe,
    ]
  );

  const redirectToSwitchNetwork = useCallback(() => {
    navigate(Routes.SETTINGS_SCREEN, {
      initialRoute: Routes.NETWORK_SECTION,
    });
  }, [navigate]);

  return {
    primarySafe,
    showLoading,
    isCreatingProfile,
    safesCount,
    network,
    isFetching,
    refetch,
    redirectToSwitchNetwork,
    isConnectionError,
    isCreateProfileError,
    retryCurrentCreateProfile,
  };
};

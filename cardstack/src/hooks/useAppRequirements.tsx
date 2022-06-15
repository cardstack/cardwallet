import compareVersions from 'compare-versions';
import { useMemo } from 'react';
import DeviceInfo from 'react-native-device-info';

import { useLoadRemoteConfigs } from '@cardstack/hooks';
import { remoteFlags } from '@cardstack/services/remote-config';

import { useHideSplashScreen } from '@rainbow-me/hooks';

export const useAppRequirements = () => {
  // Starts remote config fetcher.
  const { isReady } = useLoadRemoteConfigs();
  const hideSplashScreen = useHideSplashScreen();

  const forceUpdate = useMemo(() => {
    if (!isReady) return false;

    const appVersion = DeviceInfo.getVersion();

    const minVersion = remoteFlags().requiredMinimumVersion;

    return compareVersions(minVersion, appVersion) > 0;
  }, [isReady]);

  const maintenanceMode = remoteFlags().maintenanceActive;

  if (forceUpdate || maintenanceMode) {
    hideSplashScreen();
  }

  return {
    forceUpdate,
    maintenance: {
      active: maintenanceMode,
      message: remoteFlags().maintenanceMessage,
    },
  };
};

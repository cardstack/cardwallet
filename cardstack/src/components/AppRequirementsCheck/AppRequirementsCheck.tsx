import compareVersions from 'compare-versions';
import React, { ReactNode, useMemo } from 'react';
import DeviceInfo from 'react-native-device-info';

import { MinimumVersion } from '@cardstack/components/MinimumVersion';
import { useLoadRemoteConfigs } from '@cardstack/hooks';
import { remoteFlags } from '@cardstack/services/remote-config';

import { useHideSplashScreen } from '@rainbow-me/hooks';
import MaintenanceMode from '@rainbow-me/screens/MaintenanceMode';

interface Props {
  children: ReactNode;
}

export const AppRequirementsCheck = ({ children }: Props) => {
  // Starts remote config fetcher.
  const { isReady } = useLoadRemoteConfigs();
  const hideSplashScreen = useHideSplashScreen();

  const forceUpdate = useMemo(() => {
    if (!isReady) return false;

    const appVersion = DeviceInfo.getVersion();

    const minVersion = remoteFlags().requiredMinimumVersion;

    return compareVersions(minVersion, appVersion) > 0;
  }, [isReady]);

  if (isReady && remoteFlags().maintenanceActive) {
    hideSplashScreen();

    return <MaintenanceMode message={remoteFlags().maintenanceMessage} />;
  }

  if (forceUpdate) {
    hideSplashScreen();

    return <MinimumVersion />;
  }

  return children;
};

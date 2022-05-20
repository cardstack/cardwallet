import compareVersions from 'compare-versions';
import React, { ReactNode, useMemo } from 'react';
import VersionNumber from 'react-native-version-number';

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

    const appVersion = VersionNumber.appVersion;

    const minVersion = remoteFlags().requiredMinimumVersion;

    return compareVersions(minVersion, appVersion) > 0;
  }, [isReady]);

  if (isReady && remoteFlags().maintenanceActive) {
    return <MaintenanceMode message={remoteFlags().maintenanceMessage} />;
  }

  if (forceUpdate) {
    return <MinimumVersion />;
  }

  if (isReady) hideSplashScreen?.();

  return children;
};

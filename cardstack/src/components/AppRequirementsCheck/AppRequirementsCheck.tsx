import compareVersions from 'compare-versions';
import React, { ReactNode, useMemo } from 'react';
import VersionNumber from 'react-native-version-number';

import { MinimumVersion } from '@cardstack/components/MinimumVersion';
import { useLoadRemoteConfigs } from '@cardstack/hooks';
import {
  ConfigKey,
  getRemoteConfigAsBoolean,
  getRemoteConfigAsString,
} from '@cardstack/services/remote-config';

import { useHideSplashScreen } from '@rainbow-me/hooks';
import MaintenanceMode from '@rainbow-me/screens/MaintenanceMode';

interface Props {
  children: ReactNode;
}

export const AppRequirementsCheck = ({ children }: Props) => {
  // Starts remote config fetcher.
  const { isReady } = useLoadRemoteConfigs();
  const hideSplashScreen = useHideSplashScreen();

  const maintenanceActive = useMemo(
    () => isReady && getRemoteConfigAsBoolean(ConfigKey.maintenanceActive),
    [isReady]
  );

  const maintenanceMessage = useMemo(
    () => isReady && getRemoteConfigAsString(ConfigKey.maintenanceMessage),
    [isReady]
  );

  const forceUpdate = useMemo(() => {
    if (!isReady) return false;

    const appVersion = VersionNumber.appVersion;

    const minVersion = getRemoteConfigAsString(
      ConfigKey.requiredMinimumVersion
    );

    return compareVersions(minVersion, appVersion) > 0;
  }, [isReady]);

  if (maintenanceActive) {
    return <MaintenanceMode message={maintenanceMessage} />;
  }

  if (forceUpdate) {
    return <MinimumVersion />;
  }

  if (isReady) hideSplashScreen?.();

  return children;
};

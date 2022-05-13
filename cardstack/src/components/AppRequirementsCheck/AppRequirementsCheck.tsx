import compareVersions from 'compare-versions';
import React, { ReactNode, useMemo } from 'react';
import VersionNumber from 'react-native-version-number';

import { MinimumVersion } from '@cardstack/components/MinimumVersion';
import { useRemoteConfigs } from '@cardstack/hooks';
import {
  ConfigKey,
  getConfigString,
  getConfigJSON,
} from '@cardstack/services/remote-config';

import MaintenanceMode from '@rainbow-me/screens/MaintenanceMode';

interface Props {
  children: ReactNode;
}

export const AppRequirementsCheck = ({ children }: Props) => {
  // Starts remote config fetcher.
  const { isReady } = useRemoteConfigs();

  const maintenance = useMemo(
    () => isReady && getConfigJSON(ConfigKey.maintenanceStatus),
    [isReady]
  );

  const forceUpdate = useMemo(() => {
    if (!isReady) return false;

    const appVersion = VersionNumber.appVersion;
    const minVersion = getConfigString(ConfigKey.requiredMinimumVersion);

    return compareVersions(minVersion, appVersion) > 0;
  }, [isReady]);

  if (maintenance?.active) {
    return <MaintenanceMode message={maintenance.message} />;
  }

  if (forceUpdate) {
    return <MinimumVersion />;
  }

  return children;
};

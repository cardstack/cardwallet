import remoteConfig from '@react-native-firebase/remote-config';

import { remoteConfigDefaults } from './remoteConfigDefaults';

const CACHE_INTERVAL_MILLIS = __DEV__ ? 60000 : 21600000; // 21600000ms == 6hrs.

type RemoteConfigValues = typeof remoteConfigDefaults;

type ConfigKey = keyof RemoteConfigValues;

export const loadRemoteConfigs = async () => {
  await remoteConfig().setConfigSettings({
    minimumFetchIntervalMillis: CACHE_INTERVAL_MILLIS,
  });

  await remoteConfig().setDefaults(remoteConfigDefaults);
  await remoteConfig().fetchAndActivate();
};

export const forceFetch = async () => {
  await remoteConfig().fetch(0);
  await remoteConfig().activate();
};

const getRemoteConfigAsBoolean = (key: ConfigKey) =>
  remoteConfig().getValue(key).asBoolean();

const getRemoteConfigAsString = (key: ConfigKey) =>
  remoteConfig().getValue(key).asString();

export const remoteFlags = (): { [K in ConfigKey]: RemoteConfigValues[K] } => ({
  requiredMinimumVersion: getRemoteConfigAsString('requiredMinimumVersion'),
  maintenanceActive: getRemoteConfigAsBoolean('maintenanceActive'),
  maintenanceMessage: getRemoteConfigAsString('maintenanceMessage'),
  featurePrepaidCardDrop: getRemoteConfigAsBoolean('featurePrepaidCardDrop'),
  featureProfilePurchaseOnboarding: getRemoteConfigAsBoolean(
    'featureProfilePurchaseOnboarding'
  ),
  betaAccessGranted: getRemoteConfigAsBoolean('betaAccessGranted'),
  useHttpSokolNode: getRemoteConfigAsBoolean('useHttpSokolNode'),
});

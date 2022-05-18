import remoteConfig from '@react-native-firebase/remote-config';

import remoteConfigDefaults from './remote_config_defaults.json';

const CACHE_INTERVAL_MILLIS = __DEV__ ? 60000 : 21600000; // 21600000ms == 6hrs.

export enum ConfigKey {
  requiredMinimumVersion = 'requiredMinimumVersion',
  maintenanceActive = 'maintenanceActive',
  maintenanceMessage = 'maintenanceMessage',
  featurePrepaidCardDrop = 'featurePrepaidCardDrop',
}

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

export const getRemoteConfigAsBoolean = (key: ConfigKey) =>
  remoteConfig().getValue(key).asBoolean();

export const getRemoteConfigAsString = (key: ConfigKey) =>
  remoteConfig().getValue(key).asString();

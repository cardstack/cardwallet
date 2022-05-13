import remoteConfig from '@react-native-firebase/remote-config';

import remoteConfigDefaults from './remote_config_defaults.json';

const CACHE_INTERVAL_MILLIS = 3600; // 3600000ms == 1 hr.

export enum ConfigKey {
  requiredMinimumVersion = 'requiredMinimumVersion',
  maintenanceStatus = 'maintenanceStatus',
  appReviewFeature = 'appReviewFeature',
}

export const fetchRemoteConfigs = async () => {
  await remoteConfig().setConfigSettings({
    minimumFetchIntervalMillis: CACHE_INTERVAL_MILLIS,
  });

  await remoteConfig().setDefaults(remoteConfigDefaults);
  const fetchedRemotely = await remoteConfig().fetchAndActivate();

  return {
    fetchedRemotely,
  };
};

export const getConfigBoolean = (key: ConfigKey) =>
  remoteConfig().getValue(key).asBoolean();

export const getConfigString = (key: ConfigKey) =>
  remoteConfig().getValue(key).asString();

export const getConfigJSON = (key: ConfigKey) =>
  JSON.parse(remoteConfig().getValue(key).asString());

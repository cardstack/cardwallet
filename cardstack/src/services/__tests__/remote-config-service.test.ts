import compareVersions from 'compare-versions';

import {
  ConfigKey,
  getConfigString,
  getConfigJSON,
  getConfigBoolean,
  fetchRemoteConfigs,
} from '@cardstack/services/remote-config';

describe('Firebase Remote Config', () => {
  it(`should initialize remote configs`, async () => {
    // fetchedRemotely doesn't always return true, even when it actually had
    // fetched remotely, that happens because of remote config's internal cache.
    const fetchedRemotely = await fetchRemoteConfigs();
    expect(fetchedRemotely).toBeInstanceOf(Boolean);
  });

  it(`should have maintenanceStatus config`, async () => {
    const maintenanceStatus = getConfigJSON(ConfigKey.maintenanceStatus);
    expect(maintenanceStatus).toHaveProperty('active');
    expect(maintenanceStatus).toHaveProperty('message');
  });

  it(`should have requiredMinimumVersion config`, async () => {
    const requiredMinimumVersion = getConfigString(
      ConfigKey.requiredMinimumVersion
    );

    expect(compareVersions.validate(requiredMinimumVersion)).toBeTruthy();
  });

  it(`should have appReviewFeature config`, async () => {
    const appReviewFeature = getConfigBoolean(ConfigKey.appReviewFeature);
    expect(appReviewFeature).toBeInstanceOf(Boolean);
  });
});

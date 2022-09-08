import { appName } from '@cardstack/constants';

export const remoteConfigDefaults = {
  requiredMinimumVersion: '1.1.1',
  maintenanceActive: false,
  maintenanceMessage: `${appName} is going through scheduled maintenance, please try again later.`,
  featurePrepaidCardDrop: false,
  featureProfilePurchaseOnboarding: false,
  betaAccessGranted: false,
  useHttpSokolNode: true,
};

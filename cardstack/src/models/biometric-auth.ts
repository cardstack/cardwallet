import * as LocalAuthentication from 'expo-local-authentication';
import { SecurityLevel, AuthenticationType } from 'expo-local-authentication';

import { Device } from '@cardstack/utils';

import logger from 'logger';

export enum SecurityType {
  NONE = 1,
  PIN = 2,
  FINGERPRINT = 3,
  FACE = 4,
  BIOMETRIC = 5,
}

export const biometricAuthentication = async (
  options?: LocalAuthentication.LocalAuthenticationOptions
): Promise<boolean> => {
  try {
    console.log('::: biometricAuthentication');
    const response = await LocalAuthentication.authenticateAsync(options);
    console.log('::: biometricAuthentication response', response);

    return response.success;
  } catch (error) {
    logger.sentry('Authentication with biometrics failed', error);

    return false;
  }
};

export const getSecurityType = async (): Promise<SecurityType> => {
  const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();
  const authType = await LocalAuthentication.supportedAuthenticationTypesAsync();

  if (securityLevel === SecurityLevel.BIOMETRIC) {
    // Special case for Android where both Fingerprint and Face ID are possible,
    // but we can't know for sure which the user has enabled in their settings.
    if (
      Device.isAndroid &&
      authType.includes(AuthenticationType.FACIAL_RECOGNITION) &&
      authType.includes(AuthenticationType.FINGERPRINT)
    ) {
      return SecurityType.BIOMETRIC;
    }

    // For biometry, first check for Face id or Iris.
    if (
      authType.includes(AuthenticationType.FACIAL_RECOGNITION) ||
      authType.includes(AuthenticationType.IRIS)
    ) {
      return SecurityType.FACE;
    }

    // Then check for fingerprint.
    if (authType.includes(AuthenticationType.FINGERPRINT)) {
      return SecurityType.FINGERPRINT;
    }
  }

  if (securityLevel === SecurityLevel.SECRET) {
    return SecurityType.PIN;
  }

  // SecurityLevel.NONE
  return SecurityType.NONE;
};

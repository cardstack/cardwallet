import * as LocalAuthentication from 'expo-local-authentication';
import { SecurityLevel, AuthenticationType } from 'expo-local-authentication';

import logger from 'logger';

export enum SecurityType {
  NONE = 1,
  PIN = 2,
  FINGERPRINT = 3,
  FACE = 4,
}

export const biometricAuthentication = async (
  options?: LocalAuthentication.LocalAuthenticationOptions
): Promise<boolean> => {
  try {
    const response = await LocalAuthentication.authenticateAsync(options);

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

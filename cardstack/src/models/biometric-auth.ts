import * as LocalAuthentication from 'expo-local-authentication';
import { SecurityLevel, AuthenticationType } from 'expo-local-authentication';

import logger from 'logger';

enum SecurityType {
  NONE = 0,
  PIN = 1,
  FINGERPRINT = 2,
  FACE = 3,
}

const authenticate = async (
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

const getSecurityType = async (): Promise<SecurityType> => {
  const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();
  const authType = await LocalAuthentication.supportedAuthenticationTypesAsync();

  console.log(':::', { securityLevel, authType });

  if (securityLevel === SecurityLevel.NONE) {
    return SecurityType.NONE;
  }

  if (securityLevel === SecurityLevel.SECRET) {
    return SecurityType.PIN;
  }

  if (securityLevel === SecurityLevel.BIOMETRIC) {
    if (authType.includes(AuthenticationType.FINGERPRINT)) {
      return SecurityType.FINGERPRINT;
    }

    if (
      authType.includes(AuthenticationType.FACIAL_RECOGNITION) ||
      authType.includes(AuthenticationType.IRIS)
    ) {
      return SecurityType.FACE;
    }
  }

  return SecurityType.NONE;
};

export { authenticate, getSecurityType, SecurityType };

import * as LocalAuthentication from 'expo-local-authentication';
export { SecurityLevel, AuthenticationType } from 'expo-local-authentication';
import { last } from 'lodash';

import logger from 'logger';

const authenticate = async (
  options?: LocalAuthentication.LocalAuthenticationOptions
) => {
  try {
    const response = await LocalAuthentication.authenticateAsync(options);

    return response.success;
  } catch (error) {
    logger.sentry('Local authentication failed', error);

    return false;
  }
};

const securityLevel = async () => {
  try {
    return await LocalAuthentication.getEnrolledLevelAsync();
  } catch (error) {
    logger.sentry('Local authentication failed', error);

    return false;
  }
};

const authenticationType = async () => {
  try {
    const response = await LocalAuthentication.supportedAuthenticationTypesAsync();

    return last(response);
  } catch (error) {
    logger.sentry('Local authentication failed', error);

    return false;
  }
};

// todo: Check hardware support
// todo: Check security level for icons

export { authenticate, securityLevel, authenticationType };

import * as LocalAuthentication from 'expo-local-authentication';

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

export { authenticate };

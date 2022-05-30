import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_KEY } from 'react-native-dotenv';

import logger from 'logger';

const keys = {
  AUTH_PIN: `${SECURE_STORE_KEY}_AUTH_PIN`,
  SEED: `${SECURE_STORE_KEY}_SEED`,
} as const;

type KeysType = typeof keys;

type Keys = KeysType[keyof KeysType];

const getSecureValue = async (
  key: Keys,
  options?: SecureStore.SecureStoreOptions
) => {
  try {
    const result = await SecureStore.getItemAsync(key, options);

    return result;
  } catch (e) {
    const secureKey = key.replace(`${SECURE_STORE_KEY}_`, '');

    logger.sentry(`No value for key: ${secureKey}`, e);

    return null;
  }
};

// PIN
const savePin = (pin: string) => SecureStore.setItemAsync(keys.AUTH_PIN, pin);

const getPin = () => getSecureValue(keys.AUTH_PIN);

const deletePin = () => SecureStore.deleteItemAsync(keys.AUTH_PIN);

export { savePin, getPin, deletePin };

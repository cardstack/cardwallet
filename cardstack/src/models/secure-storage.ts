import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_KEY } from 'react-native-dotenv';

import AesEncryptor from '@rainbow-me/handlers/aesEncryption';
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

const encryptor = new AesEncryptor();

// SEED
const getSeedKey = (walletId: string) => `${keys.SEED}_${walletId}`;

const saveSeedPhrase = async (seed: string, walletId: string) => {
  try {
    const pin = await getPin();
    console.log({ pin });

    if (pin) {
      const encryptedSeed = await encryptor.encrypt(pin, seed);

      if (encryptedSeed) {
        console.log({ encryptedSeed });
        const seedKey = getSeedKey(walletId);

        await SecureStore.setItemAsync(seedKey, encryptedSeed);
      }
    }
  } catch (e) {
    logger.sentry('Error saving seed', e);
  }
};

const getSeedPhrase = async (walletId: string, pin: string) => {
  const seedKey = getSeedKey(walletId);

  try {
    const encryptedSeed = await getSecureValue(seedKey as Keys);

    if (encryptedSeed) {
      const seed = await encryptor.decrypt(pin, encryptedSeed);

      return seed;
    }
  } catch (e) {
    logger.sentry('Error retrieving seed', e);
  }
};

const deleteSeedPhrase = async (walletId: string) => {
  const seedKey = getSeedKey(walletId);

  await SecureStore.deleteItemAsync(seedKey);
};

export {
  savePin,
  getPin,
  deletePin,
  deleteSeedPhrase,
  getSeedPhrase,
  saveSeedPhrase,
};

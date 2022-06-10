import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_KEY } from 'react-native-dotenv';

import AesEncryptor from '@rainbow-me/handlers/aesEncryption';
import logger from 'logger';

const keys = {
  AUTH_PIN: `${SECURE_STORE_KEY}_AUTH_PIN`,
  SEED: `${SECURE_STORE_KEY}_SEED`,
  PKEY: `${SECURE_STORE_KEY}_PKEY`,
} as const;

type KeysType = typeof keys;

type Keys = KeysType[keyof KeysType];

const trimSecureKey = (key: Keys) => key.replace(`${SECURE_STORE_KEY}_`, '');

const getSecureValue = async (
  key: Keys,
  options?: SecureStore.SecureStoreOptions
) => {
  try {
    const result = await SecureStore.getItemAsync(key, options);

    return result;
  } catch (e) {
    const secureKey = trimSecureKey(key);

    logger.sentry(`No value for key: ${secureKey}`, e);

    return null;
  }
};

const getEncryptedItemByKey = async (key: Keys) => {
  try {
    const pin = (await getPin()) || '';
    const encryptedValue = await getSecureValue(key);

    if (encryptedValue) {
      const item = await encryptor.decrypt(pin, encryptedValue);

      return item;
    }
  } catch (e) {
    const secureKey = trimSecureKey(key);
    logger.sentry(`Error getting ${secureKey} encrypted item`, e);

    return null;
  }
};

const setEncryptedItem = async (item: string, key: Keys, pin: string) => {
  const secureKey = trimSecureKey(key);

  try {
    const encryptedItem = await encryptor.encrypt(pin, item);

    if (encryptedItem) {
      await SecureStore.setItemAsync(key, encryptedItem);
      logger.sentry(`Saved ${secureKey} encrypted item`);
    }
  } catch (e) {
    logger.sentry(`Error saving ${secureKey} encrypted item`, e);
  }
};

const buildKeyWithId = (key: Keys, id: string) => `${key}_${id}`;

// PIN
const savePin = (pin: string) => SecureStore.setItemAsync(keys.AUTH_PIN, pin);

const getPin = () => getSecureValue(keys.AUTH_PIN);

const deletePin = () => SecureStore.deleteItemAsync(keys.AUTH_PIN);

const encryptor = new AesEncryptor();

// SEED
const saveSeedPhrase = async (seed: string, walletId: string, pin: string) => {
  const seedKey = buildKeyWithId(keys.SEED, walletId);

  await setEncryptedItem(seed, seedKey as Keys, pin);
};

const getSeedPhrase = async (walletId: string) => {
  const seedKey = buildKeyWithId(keys.SEED, walletId);

  const seedPhrase = await getEncryptedItemByKey(seedKey as Keys);

  return seedPhrase;
};

const deleteSeedPhrase = async (walletId: string) => {
  const seedKey = buildKeyWithId(keys.SEED, walletId);

  await SecureStore.deleteItemAsync(seedKey);
};

// PRIVATE_KEY
const savePrivateKey = async (privateKey: string, walletAddress: string) => {
  try {
    const pin = (await getPin()) || '';

    const pKey = buildKeyWithId(keys.PKEY, walletAddress);

    await setEncryptedItem(privateKey, pKey as Keys, pin);
  } catch (e) {
    logger.sentry('Error saving provate key', e);
  }
};

const getPrivateKey = async (walletAddress: string) => {
  const pKey = buildKeyWithId(keys.PKEY, walletAddress);

  const privateKey = await getEncryptedItemByKey(pKey as Keys);

  return privateKey;
};

const deletePrivateKey = async (walletAddress: string) => {
  const pKey = buildKeyWithId(keys.PKEY, walletAddress);

  await SecureStore.deleteItemAsync(pKey);
};

export {
  savePin,
  getPin,
  deletePin,
  getSeedPhrase,
  saveSeedPhrase,
  deleteSeedPhrase,
  savePrivateKey,
  getPrivateKey,
  deletePrivateKey,
};

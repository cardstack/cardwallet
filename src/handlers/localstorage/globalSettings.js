import { isSupportedChain } from '@cardstack/cardpay-sdk';

import { NetworkType } from '@cardstack/types';

import { logger } from 'logger';

import { getGlobal, removeLocal, saveGlobal } from './common';

const IMAGE_METADATA = 'imageMetadata';
const NATIVE_CURRENCY = 'nativeCurrency';
const NETWORK = 'network';
const KEYCHAIN_INTEGRITY_STATE = 'keychainIntegrityState';
const AUTH_TIMELOCK = 'authTimelock';
const PIN_AUTH_ATTEMPTS_LEFT = 'pinAuthAttemptsLeft';
const PIN_AUTH_ATTEMPTS = 'pinAuthAttempts';
const PIN_AUTH_NEXT_DATE_ATTEMPT = 'pinAuthNextDateAttempts';

export const getKeychainIntegrityState = () =>
  getGlobal(KEYCHAIN_INTEGRITY_STATE, null);

export const saveKeychainIntegrityState = state =>
  saveGlobal(KEYCHAIN_INTEGRITY_STATE, state);

export const deleteKeychainIntegrityState = () =>
  removeLocal(KEYCHAIN_INTEGRITY_STATE);

export const getAuthTimelock = () => getGlobal(AUTH_TIMELOCK, null);

export const saveAuthTimelock = ts => saveGlobal(AUTH_TIMELOCK, ts);
export const getPinAuthAttemptsLeft = () =>
  getGlobal(PIN_AUTH_ATTEMPTS_LEFT, null);

export const savePinAuthAttemptsLeft = amount =>
  saveGlobal(PIN_AUTH_ATTEMPTS_LEFT, amount);

export const getNetwork = async () => {
  const defaultNetwork = NetworkType.gnosis;

  try {
    const network = await getGlobal(NETWORK, defaultNetwork);

    if (isSupportedChain(network)) {
      return network;
    }

    await saveNetwork(defaultNetwork);
  } catch (e) {
    logger.sentry('[Storage]: Failed getting network, returning default');
  }

  return defaultNetwork;
};

export const saveNetwork = network => saveGlobal(NETWORK, network);

export const getNativeCurrency = () => getGlobal(NATIVE_CURRENCY, 'USD');

export const saveNativeCurrency = nativeCurrency =>
  saveGlobal(NATIVE_CURRENCY, nativeCurrency);

export const getImageMetadata = () => getGlobal(IMAGE_METADATA, {});

export const saveImageMetadata = imageMetadata =>
  saveGlobal(IMAGE_METADATA, imageMetadata);

export const getPinAuthAttempts = () => getGlobal(PIN_AUTH_ATTEMPTS, 0);

export const savePinAuthAttempts = (amount = 0) =>
  saveGlobal(PIN_AUTH_ATTEMPTS, amount);

export const getPinAuthNextDateAttempt = () =>
  getGlobal(PIN_AUTH_NEXT_DATE_ATTEMPT, null);

export const savePinAuthNextDateAttempt = timestamp =>
  saveGlobal(PIN_AUTH_NEXT_DATE_ATTEMPT, timestamp);

export const deletePinAuthAttemptsData = async () => {
  await removeLocal(PIN_AUTH_NEXT_DATE_ATTEMPT);
  await removeLocal(PIN_AUTH_ATTEMPTS);
};

import { CARDWALLET_MASTER_KEY } from 'react-native-dotenv';
import AesEncryptor from '../handlers/aesEncryption';
import * as keychain from '../model/keychain';
import { pinKey } from '../utils/keychainConstants';
import { Navigation, Routes } from '@cardstack/navigation';

const encryptor = new AesEncryptor();

export async function DEPRECATED_getExistingPIN() {
  try {
    const encryptedPin = await keychain.loadString(pinKey);
    // The user has a PIN already, we need to decrypt it
    if (encryptedPin) {
      const userPIN = await encryptor.decrypt(
        CARDWALLET_MASTER_KEY,
        encryptedPin
      );
      return userPIN;
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return null;
}

export async function DEPRECATED_authenticateWithPIN(promptMessage) {
  let validPin;
  try {
    validPin = await DEPRECATED_getExistingPIN();
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return new Promise((resolve, reject) => {
    return Navigation.handleAction(Routes.PIN_AUTHENTICATION_SCREEN, {
      onCancel: reject,
      onSuccess: resolve,
      validPin,
      promptMessage,
    });
  });
}

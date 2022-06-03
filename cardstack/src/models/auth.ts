import { getPin } from './secure-storage';

const authenticate = async (pin?: string, isBiometricAuthValid?: boolean) => {
  const storedPin = await getPin();

  if (!storedPin) {
    // TODO: Handle prompt pin screen
    return;
  }

  if (isBiometricAuthValid) {
    return storedPin;
  }

  if (pin && pin === storedPin) {
    return pin;
  }

  return null;
};

export { authenticate };

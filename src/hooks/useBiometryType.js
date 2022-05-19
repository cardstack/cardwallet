import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import { isPinOrFingerprintSet } from 'react-native-device-info';
import * as Keychain from 'react-native-keychain';
import BiometryTypes from '../helpers/biometryTypes';
import useAppState from './useAppState';
import useIsMounted from './useIsMounted';
import usePrevious from './usePrevious';

export default function useBiometryType() {
  const { justBecameActive } = useAppState();
  const isMounted = useIsMounted();
  const [biometryType, setBiometryType] = useState(null);
  const prevBiometricType = usePrevious(biometryType);

  useEffect(() => {
    const getSupportedBiometryType = async () => {
      let type = await Keychain.getSupportedBiometryType();

      if (isNil(type)) {
        // 💡️ When `getSupportedBiometryType` returns `null` it can mean either:
        //    A) the user has no device passcode/biometrics at all
        //    B) the user has gone into Settings and disabled biometrics specifically for Rainbow
        type = await isPinOrFingerprintSet().then(isPinOrFingerprintSet =>
          isPinOrFingerprintSet ? BiometryTypes.passcode : BiometryTypes.none
        );
      }

      if (isMounted.current && type !== prevBiometricType) {
        setBiometryType(type);
      }
    };

    if (!biometryType || justBecameActive) {
      getSupportedBiometryType();
    }
  }, [biometryType, isMounted, justBecameActive, prevBiometricType]);

  return biometryType;
}

const mapBiometryTypeToIconName = {
  [BiometryTypes.Face]: 'face-id',
  [BiometryTypes.FaceID]: 'face-id',
  [BiometryTypes.Fingerprint]: 'thumbprint',
  [BiometryTypes.passcode]: 'lock',
  [BiometryTypes.TouchID]: 'thumbprint',
  [BiometryTypes.none]: 'lock',
};

const biometryLabels = {
  FaceID: 'Face ID',
  TouchID: 'Touch ID',
  PIN: 'PIN',
  None: null,
};

const mapBiometryTypeToLabelName = {
  [BiometryTypes.Face]: biometryLabels.FaceID,
  [BiometryTypes.FaceID]: biometryLabels.FaceID,
  [BiometryTypes.Fingerprint]: biometryLabels.TouchID,
  [BiometryTypes.TouchID]: biometryLabels.TouchID,
  [BiometryTypes.passcode]: biometryLabels.PIN,
  [BiometryTypes.none]: biometryLabels.None,
};

export const useBiometryIconName = () => {
  const biometryType = useBiometryType();

  return mapBiometryTypeToIconName[biometryType];
};

export const useBiometryLabel = () => {
  const biometryType = useBiometryType();

  return mapBiometryTypeToLabelName[biometryType];
};

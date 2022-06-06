import { useCallback, useEffect, useState } from 'react';
import useAppState from './useAppState';
import usePrevious from './usePrevious';

import {
  getSecurityType,
  SecurityType,
} from '@cardstack/models/biometric-auth';

const securityTypeToIcon = {
  [SecurityType.FACE]: 'face-id',
  [SecurityType.FINGERPRINT]: 'thumbprint',
  [SecurityType.PIN]: 'lock',
  [SecurityType.NONE]: 'lock',
};

const securityTypeToLabel = {
  [SecurityType.FACE]: 'Face ID',
  [SecurityType.FINGERPRINT]: 'Touch ID',
  [SecurityType.PIN]: 'PIN',
  [SecurityType.NONE]: null,
};

export default function useBiometryType() {
  const { justBecameActive } = useAppState();
  const [biometryType, setBiometryType] = useState(null);
  const prevBiometricType = usePrevious(biometryType);

  const getBiometryType = useCallback(async () => {
    const type = await getSecurityType();
    if (type !== prevBiometricType) {
      setBiometryType(type);
    }
  }, [prevBiometricType]);

  useEffect(() => {
    if (justBecameActive) getBiometryType();
  }, [justBecameActive, getBiometryType]);

  console.log(':::', { biometryType });

  return {
    biometryType,
    iconName: securityTypeToIcon[biometryType],
    label: securityTypeToLabel[biometryType],
  };
}

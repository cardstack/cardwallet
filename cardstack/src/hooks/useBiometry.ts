import { useCallback, useEffect, useState, useMemo } from 'react';

import { IconProps, IconName } from '@cardstack/components';
import { useAppState } from '@cardstack/hooks/useAppState';
import {
  getSecurityType,
  SecurityType,
} from '@cardstack/models/biometric-auth';

import { usePrevious } from '@rainbow-me/hooks';

const securityTypeToIcon = {
  [SecurityType.BIOMETRIC]: 'lock',
  [SecurityType.FACE]: 'face-id',
  [SecurityType.FINGERPRINT]: 'thumbprint',
  [SecurityType.PIN]: 'lock',
  [SecurityType.NONE]: 'lock',
};

const securityTypeToLabel = {
  [SecurityType.BIOMETRIC]: 'biometrics',
  [SecurityType.FACE]: 'Face ID',
  [SecurityType.FINGERPRINT]: 'Touch ID',
  [SecurityType.PIN]: 'PIN',
  [SecurityType.NONE]: null,
};

export const useBiometry = () => {
  const { justBecameActive } = useAppState();
  const [biometryType, setBiometryType] = useState<SecurityType | null>(null);
  const prevBiometricType = usePrevious(biometryType);

  const getBiometryType = useCallback(async () => {
    const type = await getSecurityType();

    if (type !== prevBiometricType) {
      setBiometryType(type);
    }
  }, [prevBiometricType]);

  useEffect(() => {
    // We need to check again for biometry type on app becoming active in case a user changes their settings.
    if (!biometryType || justBecameActive) {
      getBiometryType();
    }
  }, [biometryType, justBecameActive, getBiometryType]);

  const biometryProps = useMemo(() => {
    const biometryIconProps: IconProps | undefined = biometryType
      ? { name: securityTypeToIcon[biometryType] as IconName }
      : undefined;

    const biometryLabel = biometryType
      ? securityTypeToLabel[biometryType]
      : null;

    const biometryAvailable =
      !!biometryType &&
      (biometryType === SecurityType.FACE ||
        biometryType === SecurityType.FINGERPRINT ||
        biometryType === SecurityType.BIOMETRIC);

    return {
      biometryLabel,
      biometryAvailable,
      biometryIconProps,
    };
  }, [biometryType]);

  return {
    biometryType,
    ...biometryProps,
  };
};

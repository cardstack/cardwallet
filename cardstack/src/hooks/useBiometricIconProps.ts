import { useMemo } from 'react';

import { IconProps, IconName } from '@cardstack/components';

import { useBiometryType } from '@rainbow-me/hooks';

export const useBiometricIconProps = () => {
  const { iconName } = useBiometryType();

  const iconProps: IconProps | undefined = useMemo(
    () => (iconName ? { name: iconName as IconName } : undefined),
    [iconName]
  );

  return iconProps;
};

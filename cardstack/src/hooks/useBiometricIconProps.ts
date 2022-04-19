import { useMemo } from 'react';

import { IconProps, IconName } from '@cardstack/components';

import { useBiometryIconName } from '@rainbow-me/hooks';

export const useBiometricIconProps = () => {
  const iconName = useBiometryIconName();

  const iconProps: IconProps | undefined = useMemo(
    () => (iconName ? { name: iconName as IconName } : undefined),
    [iconName]
  );

  return iconProps;
};

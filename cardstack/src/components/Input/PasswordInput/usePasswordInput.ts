import { useCallback, useMemo, useState } from 'react';

import { IconName } from '@cardstack/components';

export const usePasswordInput = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  const iconName: IconName = useMemo(
    () => (isPasswordVisible ? 'eye-off' : 'eye'),
    [isPasswordVisible]
  );

  return {
    togglePasswordVisibility,
    iconName,
    isPasswordVisible,
  };
};

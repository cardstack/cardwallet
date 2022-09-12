import { useCallback, useMemo, useState } from 'react';

import { IconName } from '@cardstack/components';

export const usePasswordInput = () => {
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  const iconName: IconName = useMemo(
    () => (isPasswordVisible ? 'eye-off' : 'eye'),
    [isPasswordVisible]
  );

  const onChangeText = useCallback((value: string) => setPassword(value), []);

  return {
    togglePasswordVisibility,
    iconName,
    isPasswordVisible,
    password,
    onChangeText,
  };
};

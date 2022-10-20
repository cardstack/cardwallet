import { useCallback, useMemo, useState } from 'react';

interface PasswordInputProps {
  validation?: (text: string) => boolean;
}

export const usePasswordInput = ({ validation }: PasswordInputProps = {}) => {
  const [password, setPassword] = useState('');

  const isValid = useMemo(() => validation?.(password), [validation, password]);

  const onChangeText = useCallback((value: string) => setPassword(value), []);

  return {
    password,
    onChangeText,
    isValid,
  };
};

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useBiometry } from '@cardstack/hooks/useBiometry';
import {
  toggleBiometry,
  selectBiometryEnabled,
} from '@cardstack/redux/biometryToggleSlice';

export const useBiometricSwitch = () => {
  const { biometryAvailable, biometryLabel, biometryIconProps } = useBiometry();

  const dispatch = useDispatch();
  const isBiometryEnabled = useSelector(selectBiometryEnabled());

  const toggleBiometrySwitch = useCallback(() => {
    dispatch(toggleBiometry());
  }, [dispatch]);

  return {
    biometryLabel,
    biometryIconProps,
    isBiometryEnabled,
    toggleBiometrySwitch,
    biometryAvailable,
  };
};

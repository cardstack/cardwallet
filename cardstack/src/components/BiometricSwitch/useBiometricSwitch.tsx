import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useBiometricIconProps } from '@cardstack/hooks/useBiometricIconProps';
import {
  toggleBiometry,
  selectBiometryEnabled,
} from '@cardstack/redux/biometryToggleSlice';

import { useBiometryLabel } from '@rainbow-me/hooks/useBiometryType';

export const useBiometricSwitch = () => {
  const iconProps = useBiometricIconProps();
  const biometryLabel = useBiometryLabel();

  const dispatch = useDispatch();
  const isBiometryEnabled = useSelector(selectBiometryEnabled());

  const toggleBiometrySwitch = useCallback(() => dispatch(toggleBiometry()), [
    dispatch,
  ]);

  return {
    iconProps,
    biometryLabel,
    isBiometryEnabled,
    toggleBiometrySwitch,
    biometryAvailable: !!biometryLabel,
  };
};

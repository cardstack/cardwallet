import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useBiometry } from '@cardstack/hooks/useBiometry';
import {
  toggleBiometry,
  selectBiometryEnabled,
} from '@cardstack/redux/biometryToggleSlice';
import { colors } from '@cardstack/theme';
import { ThemeVariant } from '@cardstack/theme/colorStyleVariants';
import { Device } from '@cardstack/utils';

const androidSwitchLightConfig = {
  false: colors.backgroundLightGray,
  true: '', // empty to use default value
};

export const useBiometricSwitch = (variant?: ThemeVariant) => {
  const { biometryAvailable, biometryLabel, biometryIconProps } = useBiometry();

  const dispatch = useDispatch();
  const isBiometryEnabled = useSelector(selectBiometryEnabled());

  const toggleBiometrySwitch = useCallback(() => {
    dispatch(toggleBiometry());
  }, [dispatch]);

  const trackColor = useMemo(
    () =>
      Device.isAndroid && variant === 'light'
        ? androidSwitchLightConfig
        : undefined,
    [variant]
  );

  return {
    trackColor,
    biometryLabel,
    biometryIconProps,
    isBiometryEnabled,
    toggleBiometrySwitch,
    biometryAvailable,
  };
};

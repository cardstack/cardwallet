import React, { useCallback } from 'react';

import { useNavigation } from '../../navigation/Navigation';
import HeaderButton from './HeaderButton';
import { Icon } from '@cardstack/components';
import Routes from '@rainbow-me/routes';

export default function CameraHeaderButton() {
  const { navigate } = useNavigation();

  const onPress = useCallback(() => navigate(Routes.QR_SCANNER_SCREEN), [
    navigate,
  ]);

  return (
    <HeaderButton onPress={onPress} testID="goToCamera" transformOrigin="right">
      <Icon iconSize="medium" marginRight={3} name="qr-code" />
    </HeaderButton>
  );
}

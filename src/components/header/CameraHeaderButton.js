import React, { useCallback } from 'react';

import { useNavigation } from '../../navigation/Navigation';
import HeaderButton from './HeaderButton';
import { Container, Icon, Text } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';

export default function CameraHeaderButton() {
  const { navigate } = useNavigation();

  const onPress = useCallback(() => navigate(Routes.QR_SCANNER_SCREEN), [
    navigate,
  ]);

  return (
    <HeaderButton onPress={onPress} testID="goToCamera" transformOrigin="right">
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Text color="teal" size="small" weight="bold">
          Scan QR
        </Text>
        <Icon iconSize="medium" marginHorizontal={3} name="qr-code" />
      </Container>
    </HeaderButton>
  );
}

import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { KeyboardArea } from 'react-native-keyboard-area';
import styled from 'styled-components';

import { Column } from '../layout';
import { SheetHandleFixedToTopHeight } from '../sheet';
import { Container } from '@cardstack/components';
import KeyboardTypes from '@rainbow-me/helpers/keyboardTypes';
import { useDimensions, useKeyboardHeight } from '@rainbow-me/hooks';
import { sharedCoolModalTopOffset } from '@rainbow-me/navigation/config';

const KeyboardSizeView = styled(KeyboardArea)`
  background-color: ${({ theme: { colors } }) => colors.transparent};
`;

export default function BackupSheetKeyboardLayout({ children, type, footer }) {
  const { params: { nativeScreen } = {} } = useRoute();
  const { height: deviceHeight } = useDimensions();
  const keyboardHeight = useKeyboardHeight({
    keyboardType: KeyboardTypes.password,
  });

  const platformKeyboardHeight = android
    ? type === 'restore'
      ? -10
      : -30
    : keyboardHeight;

  const sheetRegionAboveKeyboardHeight =
    deviceHeight -
    platformKeyboardHeight -
    sharedCoolModalTopOffset -
    SheetHandleFixedToTopHeight;

  return (
    <Column height={nativeScreen ? undefined : sheetRegionAboveKeyboardHeight}>
      <StatusBar barStyle="light-content" />
      {children}
      <Container alignItems="center" width="100%">
        {footer}
      </Container>
      {android ? <KeyboardSizeView /> : null}
    </Column>
  );
}

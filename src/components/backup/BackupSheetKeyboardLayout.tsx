import React from 'react';
import { StatusBar } from 'react-native';
import { KeyboardArea } from 'react-native-keyboard-area';
import styled from 'styled-components';

import { Column } from '../layout';
import { Container } from '@cardstack/components';
import { Device } from '@cardstack/utils/device';

const KeyboardSizeView = styled(KeyboardArea)`
  background-color: ${({ theme: { colors } }) => colors.transparent};
`;

interface BackupSheetKeyboardLayoutProps {
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function BackupSheetKeyboardLayout({
  children,
  footer,
}: BackupSheetKeyboardLayoutProps) {
  return (
    <Column>
      <StatusBar barStyle="light-content" />
      {children}
      <Container alignItems="center" width="100%">
        {footer}
      </Container>
      {Device.isAndroid ? (
        <KeyboardSizeView>
          <Container />
        </KeyboardSizeView>
      ) : null}
    </Column>
  );
}

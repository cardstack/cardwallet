import React from 'react';
import { KeyboardAvoidingView, StatusBar } from 'react-native';

import { Column } from '../layout';
import { Container } from '@cardstack/components';
import { Device } from '@cardstack/utils/device';

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
        <KeyboardAvoidingView>
          <Container />
        </KeyboardAvoidingView>
      ) : null}
    </Column>
  );
}

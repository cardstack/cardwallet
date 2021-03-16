import React from 'react';
import { StatusBar } from 'react-native';
import { KeyboardArea } from 'react-native-keyboard-area';
import styled from 'styled-components';

import { Column } from '../layout';
import { Container } from '@cardstack/components';

const KeyboardSizeView = styled(KeyboardArea)`
  background-color: ${({ theme: { colors } }) => colors.transparent};
`;

export default function BackupSheetKeyboardLayout({ children, footer }) {
  return (
    <Column>
      <StatusBar barStyle="light-content" />
      {children}
      <Container alignItems="center" width="100%">
        {footer}
      </Container>
      {android ? <KeyboardSizeView /> : null}
    </Column>
  );
}

import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

import { CenteredContainer } from '@cardstack/components';
import { Device } from '@cardstack/utils';

import { useDimensions } from '@rainbow-me/hooks';

import TouchableBackdrop from '../../TouchableBackdrop';
import { AssetPanel, FloatingPanels } from '../../floating-panels';

export default function ProfileModal({ onPressBackdrop, ...props }) {
  const { width: deviceWidth } = useDimensions();

  return (
    <KeyboardAvoidingView behavior={Device.keyboardBehavior}>
      <CenteredContainer width={deviceWidth}>
        <TouchableBackdrop onPress={onPressBackdrop} />
        <FloatingPanels maxWidth={deviceWidth - 110}>
          <AssetPanel {...props} />
        </FloatingPanels>
      </CenteredContainer>
    </KeyboardAvoidingView>
  );
}

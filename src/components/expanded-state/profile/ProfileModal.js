import React from 'react';
import TouchableBackdrop from '../../TouchableBackdrop';
import { AssetPanel, FloatingPanels } from '../../floating-panels';
import { KeyboardFixedOpenLayout } from '../../layout';

import { useDimensions } from '@rainbow-me/hooks';

export default function ProfileModal({ onPressBackdrop, ...props }) {
  const { width: deviceWidth } = useDimensions();

  return (
    <KeyboardFixedOpenLayout>
      <TouchableBackdrop onPress={onPressBackdrop} />
      <FloatingPanels maxWidth={deviceWidth - 110}>
        <AssetPanel {...props} />
      </FloatingPanels>
    </KeyboardFixedOpenLayout>
  );
}

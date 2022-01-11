import React, { useCallback } from 'react';

import { UnderlineField } from '../fields';
import { CenteredContainer, Text } from '@cardstack/components';

const CURRENCY_LABEL_WIDTH = 100;
export default function SendAssetFormField({
  autoFocus,
  format,
  label,
  labelMaxLength = 9,
  mask,
  onChange,
  onFocus,
  onPressButton,
  placeholder,
  value,
  testID,
}) {
  const handlePressButton = useCallback(
    event => {
      onPressButton?.(event);
    },
    [onPressButton]
  );

  return (
    <CenteredContainer flexDirection="row">
      <UnderlineField
        autoFocus={autoFocus}
        buttonText="Max"
        flexGrow={1}
        format={format}
        keyboardType="decimal-pad"
        mask={mask}
        onChange={onChange}
        onFocus={onFocus}
        onPressButton={handlePressButton}
        placeholder={placeholder}
        testID={testID}
        value={value}
      />
      <CenteredContainer width={CURRENCY_LABEL_WIDTH}>
        <Text fontSize={20} fontWeight="700">
          {label?.length > labelMaxLength
            ? label.substring(0, labelMaxLength)
            : label}
        </Text>
      </CenteredContainer>
    </CenteredContainer>
  );
}

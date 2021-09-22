import React, { useCallback } from 'react';

import { UnderlineField } from '../fields';
import { RowWithMargins } from '../layout';
import { Text } from '@cardstack/components';

export default function SendAssetFormField({
  autoFocus,
  format,
  label,
  labelMaxLength = 6,
  mask,
  onChange,
  onFocus,
  onPressButton,
  placeholder,
  value,
  testID,
  ...props
}) {
  const handlePressButton = useCallback(
    event => {
      onPressButton?.(event);
    },
    [onPressButton]
  );

  return (
    <RowWithMargins
      align="center"
      flex={1}
      justify="space-between"
      margin={23}
      {...props}
    >
      <UnderlineField
        autoFocus={autoFocus}
        buttonText="Max"
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
      <Text
        fontSize={20}
        fontWeight="700"
        position="absolute"
        textAlign="right"
      >
        {label?.length > labelMaxLength
          ? label.substring(0, labelMaxLength)
          : label}
      </Text>
    </RowWithMargins>
  );
}

import React, { useCallback } from 'react';

import { UnderlineField } from '../fields';
import { CenteredContainer, Text } from '@cardstack/components';

// set currency label with fixed width to have same width inputs. 100 is good for longest currency label for now
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
  ...props
}) {
  const handlePressButton = useCallback(
    event => {
      onPressButton?.(event);
    },
    [onPressButton]
  );

  return (
    <CenteredContainer flexDirection="row" {...props}>
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

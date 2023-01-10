import React from 'react';

import { CenteredContainer } from '@cardstack/components';

import { UnderlineField } from '../fields';

const SendAssetFormField = ({
  autoFocus,
  format,
  label,
  labelMaxLength = 9,
  mask,
  onChange,
  onPressButton,
  placeholder,
  value,
  testID,
  ...props
}) => (
  <CenteredContainer {...props} flexDirection="row">
    <UnderlineField
      autoFocus={autoFocus}
      buttonText="Max"
      flex={1}
      flexGrow={1}
      format={format}
      keyboardType="decimal-pad"
      mask={mask}
      onChange={onChange}
      onPressButton={onPressButton}
      placeholder={placeholder}
      rightLabel={
        label?.length > labelMaxLength
          ? label.substring(0, labelMaxLength)
          : label
      }
      testID={testID}
      value={value}
    />
  </CenteredContainer>
);

export default SendAssetFormField;

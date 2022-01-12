import React, { useCallback } from 'react';

import { UnderlineField } from '../fields';
import { Button, CenteredContainer, Text } from '@cardstack/components';

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
  const [isFocused, setIsFocused] = useState(autoFocus);

  const handlePressButton = useCallback(
    event => {
      onPressButton?.(event);
    },
    [onPressButton]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleFocus = useCallback(
    event => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus]
  );

  return (
    <CenteredContainer {...props} flexDirection="row">
      <UnderlineField
        autoFocus={autoFocus}
        flex={1}
        flexGrow={1}
        format={format}
        keyboardType="decimal-pad"
        mask={mask}
        onBlur={handleBlur}
        onChange={onChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        testID={testID}
        value={value}
      />
      <CenteredContainer flexDirection="row" position="absolute" right={0}>
        {isFocused && (
          <Button onPress={handlePressButton} variant="tiny">
            Max
          </Button>
        )}
        <Text fontSize={20} fontWeight="700" lineHeight={24} paddingLeft={2}>
          {label?.length > labelMaxLength
            ? label.substring(0, labelMaxLength)
            : label}
        </Text>
      </CenteredContainer>
    </CenteredContainer>
  );
}

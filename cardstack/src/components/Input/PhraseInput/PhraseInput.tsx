import React, { useMemo, forwardRef, memo } from 'react';

import { Container, Input, BaseInputProps } from '@cardstack/components';
import { colors, textVariants } from '@cardstack/theme';
import { Device } from '@cardstack/utils';

// Note: This is necessary to account for lack of support for
// lineHeight in Android;
const InputHeight = Device.isIOS ? 139 : 110;

interface PasswordInputProps extends BaseInputProps {
  isValid: boolean;
}

const PhraseInput = forwardRef((props: PasswordInputProps, ref) => {
  const { onChangeText, value, isValid = true, ...inputProps } = props;

  const inputStyle = useMemo(
    () => ({
      ...textVariants.semibold,
      fontSize: 16,
      color: isValid ? colors.teal : colors.invalid,
    }),
    [isValid]
  );

  return (
    <Container
      backgroundColor="blueDarkest"
      borderColor="blueDarkest"
      borderWidth={1}
      borderRadius={20}
    >
      <Input
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        textContentType="none"
        multiline
        numberOfLines={4}
        height={InputHeight}
        lineHeight={30} // Only works on iOS
        selectionColor="teal"
        allowFontScaling={false}
        autoCompleteType="off"
        autoCapitalize="none"
        blurOnSubmit={false}
        placeholderTextColor={colors.blueText}
        textAlignVertical="top"
        paddingHorizontal={5}
        paddingBottom={3}
        style={inputStyle}
        {...inputProps}
      />
    </Container>
  );
});

export default memo(PhraseInput);

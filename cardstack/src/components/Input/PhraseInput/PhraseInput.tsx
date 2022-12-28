import React, { useMemo, forwardRef, memo } from 'react';

import { Container, Input, BaseInputProps } from '@cardstack/components';
import { colors, textVariants } from '@cardstack/theme';
import { Device } from '@cardstack/utils/device';

// Note: This is necessary to account for lack of support for
// lineHeight in Android;
const InputHeight = Device.isIOS ? 139 : 110;

interface PasswordInputProps extends BaseInputProps {
  showAsError?: boolean;
}

const PhraseInput = forwardRef((props: PasswordInputProps, ref) => {
  const { onChangeText, value, showAsError, ...inputProps } = props;

  const inputStyle = useMemo(
    () => ({
      ...textVariants.semibold,
      fontSize: 18,
      color: showAsError ? colors.invalid : colors.teal,
    }),
    [showAsError]
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
        autoComplete="off"
        autoCorrect={false}
        autoCapitalize="none"
        blurOnSubmit={true}
        placeholderTextColor={colors.blueText}
        textAlignVertical="top"
        paddingHorizontal={5}
        paddingBottom={3}
        style={inputStyle}
        returnKeyType="done"
        {...inputProps}
      />
    </Container>
  );
});

export default memo(PhraseInput);

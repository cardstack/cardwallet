import React, { memo, forwardRef } from 'react';
import { StyleSheet } from 'react-native';

import {
  Container,
  Input,
  InputProps,
  Text,
  TextProps,
} from '@cardstack/components';
import { Device } from '@cardstack/utils';
import { fontFamilyVariants, colors } from '@cardstack/theme';

const styles = StyleSheet.create({
  input: {
    color: colors.teal,
    // Input's font on android is rendering a lot smaller, not sure why.
    minWidth: Device.isAndroid ? '40%' : '32%',
    fontSize: Device.isAndroid ? 32 : 24,
    padding: 0, // Clears phantom padding on android. Keep it consistent on ios.
    left: 0,
    ...fontFamilyVariants.bold,
  },
  suffix: {
    fontSize: 24,
    ...fontFamilyVariants.bold,
  },
});

interface SuffixedInputProps extends InputProps {
  suffixText?: string;
  suffixTextProps?: TextProps;
}

const DEFAULT_MAX_LENGTH = 25;

const SuffixedInput = forwardRef(
  (
    {
      suffixText,
      suffixTextProps,
      maxLength = DEFAULT_MAX_LENGTH,
      ...props
    }: SuffixedInputProps,
    ref
  ) => (
    <Container
      width="100%"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Input
        ref={ref}
        style={styles.input}
        placeholderTextColor={colors.secondaryText}
        paddingRight={1}
        autoFocus
        multiline={false}
        spellCheck={false}
        autoCorrect={false}
        maxLength={maxLength}
        autoCapitalize="none"
        placeholder="username"
        textContentType="username"
        keyboardType="twitter"
        underlineColorAndroid="transparent"
        {...props}
      />
      <Text style={styles.suffix} color="white" {...suffixTextProps}>
        {suffixText}
      </Text>
    </Container>
  )
);

export default memo(SuffixedInput);

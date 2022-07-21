import React, { memo } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { Container, Text, TextProps } from '@cardstack/components';
import { fontFamilyVariants, colors } from '@cardstack/theme';
import { Device } from '@cardstack/utils';

import { strings } from './strings';

const styles = StyleSheet.create({
  input: {
    color: colors.teal,
    // Input's font on android is rendering a lot smaller, not sure why.
    minWidth: Device.isAndroid ? '40%' : '32%',
    fontSize: Device.isAndroid ? 32 : 24,
    padding: 0, // Clears phantom padding on android. Keep it consistent on ios.
    left: 0,
    paddingRight: 4,
    ...fontFamilyVariants.bold,
  },
  suffix: {
    fontSize: 24,
    ...fontFamilyVariants.bold,
  },
});

interface SuffixedInputProps extends TextInputProps {
  suffixText?: string;
  suffixTextProps?: TextProps;
}

const DEFAULT_MAX_LENGTH = 25;

const SuffixedInput = ({
  suffixText,
  suffixTextProps,
  maxLength = DEFAULT_MAX_LENGTH,
  placeholder = strings.defaultPlaceholder,
}: SuffixedInputProps) => (
  <Container
    width="100%"
    flexDirection="row"
    flexWrap="wrap"
    justifyContent="flex-start"
    alignItems="center"
  >
    <TextInput
      style={styles.input}
      placeholderTextColor={colors.secondaryText}
      autoFocus
      multiline={false}
      spellCheck={false}
      autoCorrect={false}
      maxLength={maxLength}
      autoCapitalize="none"
      placeholder={placeholder}
      textContentType="username"
      underlineColorAndroid="transparent"
    />
    <Text style={styles.suffix} color="white" {...suffixTextProps}>
      {suffixText}
    </Text>
  </Container>
);

export default memo(SuffixedInput);

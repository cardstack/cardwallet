import React, { memo } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { Container, Text, TextProps } from '@cardstack/components';
import { fontFamilyVariants, colors } from '@cardstack/theme';

import { strings } from './strings';

const styles = StyleSheet.create({
  input: {
    color: colors.teal,
    minWidth: '34%',
    padding: 0, // Clears phantom padding on android. Keep it consistent on ios.
    left: 0,
    paddingRight: 4,
  },
  textStyle: {
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
      style={[styles.input, styles.textStyle]}
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
    <Text style={styles.textStyle} color="white" {...suffixTextProps}>
      {suffixText}
    </Text>
  </Container>
);

export default memo(SuffixedInput);

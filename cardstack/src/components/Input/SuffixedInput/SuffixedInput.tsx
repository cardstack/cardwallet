import React, { memo } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { Container, Text, TextProps } from '@cardstack/components';
import { fontFamilyVariants, colors } from '@cardstack/theme';

import { strings } from './strings';

const styles = StyleSheet.create({
  input: {
    color: colors.teal,
    minWidth: 125, // More consistent than a percentage.
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
  readOnly?: boolean;
}

const DEFAULT_MAX_LENGTH = 25;

const SuffixedInput = ({
  suffixText,
  suffixTextProps,
  maxLength = DEFAULT_MAX_LENGTH,
  placeholder = strings.defaultPlaceholder,
  onChangeText,
  value,
  readOnly,
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
      allowFontScaling={false}
      onChangeText={onChangeText}
      value={value}
      returnKeyType="done"
      editable={!readOnly}
    />
    <Text
      style={styles.textStyle}
      allowFontScaling={false}
      color="white"
      {...suffixTextProps}
    >
      {suffixText}
    </Text>
  </Container>
);

export default memo(SuffixedInput);

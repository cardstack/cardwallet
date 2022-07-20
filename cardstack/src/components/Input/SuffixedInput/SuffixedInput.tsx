import React, { memo, forwardRef } from 'react';
import { StyleSheet } from 'react-native';

import {
  Container,
  Input,
  InputProps,
  Text,
  TextProps,
} from '@cardstack/components';
import { fontFamilyVariants, colors } from '@cardstack/theme';

const styles = StyleSheet.create({
  input: {
    top: 0.5, // Input comp. renders inner text slightly above Text comp.
    color: colors.teal,
    minWidth: '32%',
    fontSize: 24,
  },
  textFont: {
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
    <Container flexDirection="row" flexWrap="wrap">
      <Input
        ref={ref}
        autoFocus
        autoCapitalize="none"
        multiline={false}
        spellCheck={false}
        autoCorrect={false}
        maxLength={maxLength}
        style={[styles.input, styles.textFont]}
        placeholder="username"
        textContentType="username"
        underlineColorAndroid="transparent"
        keyboardType="twitter"
        paddingRight={1}
        placeholderTextColor={colors.secondaryText}
        {...props}
      />
      <Text style={styles.textFont} color="white" {...suffixTextProps}>
        {suffixText}
      </Text>
    </Container>
  )
);

export default memo(SuffixedInput);

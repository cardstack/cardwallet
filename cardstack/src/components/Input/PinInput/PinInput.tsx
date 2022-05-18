import React, { memo, useMemo, useRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Container, Input, InputProps } from '@cardstack/components';

import CharCell, { cellLayout } from './CharCell';
import { PinLayoutVariant } from './types';

const DEFAULT_PIN_LENGTH = 6;
const PIN_LENGTH = new Array(DEFAULT_PIN_LENGTH).fill('');

const styles = StyleSheet.create({
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    height: cellLayout.height,
    top: -cellLayout.height,
    opacity: 0,
  },
});

interface PinInputProps extends InputProps {
  variant: PinLayoutVariant;
  value: string;
}

const PinInput = ({
  variant,
  value = '',
  onChangeText,
  secureTextEntry = true,
  ...inputProps
}: PinInputProps) => {
  const inputRef = useRef<TextInput>();

  const renderCells = useMemo(
    () =>
      PIN_LENGTH.map((_, index) => (
        <CharCell
          index={index}
          inputValue={value}
          secureText={secureTextEntry}
          variant={variant}
        />
      )),
    [secureTextEntry, value, variant]
  );

  return (
    <Container width="85%">
      <Container justifyContent="space-between" flexDirection="row">
        {renderCells}
      </Container>
      <Input
        autoFocus
        secureTextEntry
        caretHidden
        contextMenuHidden
        ref={inputRef}
        fontSize={1}
        value={value}
        onChangeText={onChangeText}
        style={styles.hiddenInput}
        maxLength={DEFAULT_PIN_LENGTH}
        spellCheck={false}
        autoCorrect={false}
        blurOnSubmit={false}
        underlineColorAndroid="transparent"
        keyboardType="number-pad"
        {...inputProps}
      />
    </Container>
  );
};

export default memo(PinInput);

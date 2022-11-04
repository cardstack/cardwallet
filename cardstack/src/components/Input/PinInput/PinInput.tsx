import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import {
  Container,
  Input,
  InputProps,
  Text,
  Touchable,
} from '@cardstack/components';
import { colorStyleVariants } from '@cardstack/theme/colorStyleVariants';

import CharCell, { cellLayout, CharCellProps } from './CharCell';
import { strings } from './strings';

export const DEFAULT_PIN_LENGTH = 6;
const PIN_LENGTH = new Array(DEFAULT_PIN_LENGTH).fill('');

const styles = StyleSheet.create({
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    height: cellLayout.height,
    top: -cellLayout.height,
    opacity: 0,
  },
});

interface PinInputProps extends InputProps, Pick<CharCellProps, 'variant'> {
  title?: string;
  value: string;
}

const PinInput = ({
  variant,
  title,
  value = '',
  onChangeText,
  ...inputProps
}: PinInputProps) => {
  const [isPinHidden, setIsPinHidden] = useState(true);

  const inputRef = useRef<TextInput>();

  const togglePinVisibility = useCallback(() => {
    setIsPinHidden(!isPinHidden);
  }, [isPinHidden]);

  const renderCells = useMemo(
    () =>
      PIN_LENGTH.map((_, index) => (
        <CharCell
          index={index}
          inputValue={value}
          secureText={isPinHidden}
          variant={variant}
        />
      )),
    [isPinHidden, value, variant]
  );

  return (
    <Container width="85%">
      <Container
        flexDirection="row"
        justifyContent={title ? 'space-between' : 'flex-end'}
      >
        {!!title && (
          <Text
            color={colorStyleVariants.textColor[variant]}
            paddingBottom={2}
            size="small"
          >
            {title}
          </Text>
        )}
        <Touchable>
          <Text
            color={colorStyleVariants.textColor[variant]}
            paddingBottom={2}
            size="small"
            onPress={togglePinVisibility}
          >
            {isPinHidden ? strings.show : strings.hide}
          </Text>
        </Touchable>
      </Container>
      <Container justifyContent="space-between" flexDirection="row">
        {renderCells}
      </Container>
      <Input
        autoFocus
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
        returnKeyType="default"
        {...inputProps}
      />
    </Container>
  );
};

export default memo(PinInput);

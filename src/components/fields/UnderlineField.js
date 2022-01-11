import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useTheme } from '../../context/ThemeContext';
import ExchangeInput from '../exchange/ExchangeInput';
import { Row } from '../layout';
import { Button, Container } from '@cardstack/components';
import { useDimensions } from '@rainbow-me/hooks';

const defaultFormatter = string => string;

const UnderlineField = (
  {
    autoFocus,
    buttonText,
    format = defaultFormatter,
    keyboardType,
    mask,
    maxLength,
    onBlur,
    onChange,
    onFocus,
    onPressButton,
    placeholder,
    testID,
    value: valueProp,
    ...props
  },
  forwardedRef
) => {
  const { isTinyPhone } = useDimensions();

  const [isFocused, setIsFocused] = useState(autoFocus);
  const [value, setValue] = useState(valueProp);
  const [wasButtonPressed, setWasButtonPressed] = useState(false);

  const ref = useRef();
  useImperativeHandle(forwardedRef, () => ref.current);

  const formattedValue = useMemo(() => format(String(value || '')), [
    format,
    value,
  ]);

  const handleBlur = useCallback(
    event => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur]
  );

  const handleButtonPress = useCallback(
    event => {
      ref.current?.focus?.();
      setWasButtonPressed(true);
      onPressButton?.(event);
    },
    [onPressButton]
  );

  const handleChangeText = useCallback(
    text => {
      const formattedValue = format(text);

      if (value !== formattedValue) {
        setValue(formattedValue);
        onChange?.(formattedValue);
      }
    },
    [format, onChange, value]
  );

  const handleFocus = useCallback(
    event => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus]
  );

  useEffect(() => {
    if (
      valueProp !== value &&
      (!ref.current?.isFocused?.() || wasButtonPressed)
    ) {
      setValue(valueProp);
      setWasButtonPressed(false);
    }
  }, [forwardedRef, value, valueProp, wasButtonPressed]);

  const { isDarkMode } = useTheme();

  return (
    <Container flex={1} {...props}>
      <Row align="center" justify="space-between">
        <ExchangeInput
          autoFocus={autoFocus}
          color={isFocused ? 'black' : 'settingsTeal'}
          isDarkMode={isDarkMode}
          isTinyPhone={isTinyPhone}
          keyboardType={keyboardType}
          mask={mask}
          maxLength={maxLength}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          placeholder={placeholder}
          ref={ref}
          testID={testID + '-input'}
          value={formattedValue}
        />
        {buttonText && isFocused && (
          <Button onPress={handleButtonPress} variant="tiny">
            {buttonText}
          </Button>
        )}
      </Row>
      <Container
        border-radius={1}
        flexDirection="row"
        height={2}
        overflow="hidden"
        width="100%"
      >
        <Container
          backgroundColor={
            isFocused ? 'buttonPrimaryBackground' : 'underlineGray'
          }
          bottom={0}
          left={0}
          position="absolute"
          right={0}
          top={0}
        />
      </Container>
    </Container>
  );
};

export default React.forwardRef(UnderlineField);

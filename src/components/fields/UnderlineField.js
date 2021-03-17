import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { ExchangeInput } from '../exchange';
import { ColumnWithMargins, Row } from '../layout';
import { AnimatedContainer, Button, Container } from '@cardstack/components';
import { useDimensions } from '@rainbow-me/hooks';
import { position } from '@rainbow-me/styles';

// const Underline = styled.View`
//   ${position.cover};
//   background-color: ${({ theme: { colors } }) => colors.blueGreyDark};
//   opacity: 0.2;
// `;

// const UnderlineAnimated = styled(Animated.View)`
//   ${position.cover};
//   background-color: ${({ theme: { colors } }) => colors.sendScreen.brightBlue};
//   left: -100%;
// `;

const UnderlineInput = styled(ExchangeInput).attrs(
  ({ isTinyPhone, theme: { isDarkMode, colors } }) => ({
    color: colors.dark,
    disableTabularNums: true,
    keyboardAppearance: isDarkMode ? 'dark' : 'light',
    letterSpacing: 'roundedTightest',
    size: isTinyPhone || android ? 'bigger' : 'h3',
    weight: 'medium',
  })
)`
  padding-right: 8;
  ${android ? 'height: 40;' : ''}
  ${android ? 'padding-bottom: 0;' : ''}
  ${android ? 'padding-top: 0;' : ''}
`;

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
    <ColumnWithMargins flex={1} {...props}>
      <Row align="center" justify="space-between">
        <UnderlineInput
          autoFocus={autoFocus}
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
          <Button onPress={handleButtonPress} variant="extraSmall">
            {buttonText}
          </Button>
        )}
      </Row>
      <Container
        border-radius={1}
        flexDirection="row"
        height={isFocused ? 2 : 1}
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
    </ColumnWithMargins>
  );
};

export default React.forwardRef(UnderlineField);

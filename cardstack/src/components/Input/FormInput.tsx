import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import { useBooleanState } from '@cardstack/hooks';
import { Device } from '@cardstack/utils/device';

import { Container } from '../Container';
import { IconProps } from '../Icon';
import { Text } from '../Text';

import { Input, InputProps } from './Input';
import { strings } from './strings';

const baseInputProps: InputProps = {
  borderWidth: 1,
  borderRadius: 6,
  paddingHorizontal: 5,
  paddingVertical: 3,
  color: 'white',
  selectionColor: 'teal',
};

type InputIconVariants = 'valid' | 'error' | 'none';
type InputBorderColorVariants = 'focused' | 'error' | 'unfocused';

const baseIconProps: Partial<IconProps> = {
  top: Device.isIOS ? 12 : 13,
  right: 10,
};

const iconPropsMap: Record<InputIconVariants, IconProps | undefined> = {
  valid: {
    ...baseIconProps,
    name: 'check',
    color: 'greenColor',
  },
  error: {
    ...baseIconProps,
    name: 'x',
    color: 'error',
  },
  none: undefined,
};

const borderColorMap: Record<
  InputBorderColorVariants,
  InputProps['borderColor']
> = {
  focused: 'teal',
  error: 'error',
  unfocused: 'buttonSecondaryBorder',
};

const AnimatedText = Animated.createAnimatedComponent(Text);

const animConfig = {
  duration: 200,
  showError: 1,
  hideError: 0,
};

interface FormInput extends InputProps {
  label: string;
  error?: string;
  isValid?: boolean;
  isRequired?: boolean;
}

const FormInput = ({
  label,
  error,
  isRequired,
  isValid,
  ...inputProps
}: FormInput) => {
  const errorAnimation = useRef(new Animated.Value(0)).current;
  const [isFocused, setFocus, setBlur] = useBooleanState();

  const iconType = useMemo(
    () => (error ? 'error' : isValid ? 'valid' : 'none'),
    [error, isValid]
  );

  const borderType = useMemo(
    () => (error ? 'error' : isFocused ? 'focused' : 'unfocused'),
    [error, isFocused]
  );

  useEffect(() => {
    Animated.timing(errorAnimation, {
      duration: animConfig.duration,
      toValue: error ? animConfig.showError : animConfig.hideError,
      useNativeDriver: true,
    }).start();
  }, [error, errorAnimation]);

  const animatedOpacity = useMemo(
    () => ({
      opacity: errorAnimation,
    }),
    [errorAnimation]
  );

  return (
    <Container width="100%">
      <Container
        flexDirection="row"
        justifyContent="space-between"
        paddingBottom={2}
      >
        <Text color="borderGray" weight="bold" fontSize={14}>
          {label}
        </Text>
        <Text color="borderGray" fontSize={12}>
          {isRequired ? strings.required : ''}
        </Text>
      </Container>
      <Container backgroundColor="black">
        <Input
          {...baseInputProps}
          {...inputProps}
          borderColor={borderColorMap[borderType]}
          iconProps={iconPropsMap[iconType]}
          paddingRight={iconPropsMap[iconType] ? 8 : 5}
          onFocus={setFocus}
          onBlur={setBlur}
        />
      </Container>
      <Container height={20}>
        <AnimatedText
          fontSize={12}
          color="errorLight"
          weight="bold"
          paddingTop={1}
          style={animatedOpacity}
        >
          {error}
        </AnimatedText>
      </Container>
    </Container>
  );
};

export default memo(FormInput);

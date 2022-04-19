import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import { Container } from '../Container';
import { IconProps } from '../Icon';
import { Text } from '../Text';

import { Input, InputProps } from './Input';

const baseInputProps: InputProps = {
  borderWidth: 1,
  borderRadius: 6,
  paddingHorizontal: 5,
  paddingVertical: 3,
  color: 'white',
  selectionColor: 'teal',
};

type InputVariants = 'valid' | 'error' | 'default';

const baseIconProps: Partial<IconProps> = {
  top: 12,
  right: 10,
};

const iconPropsMap: Record<InputVariants, IconProps | undefined> = {
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
  default: undefined,
};

const borderColorMap: Record<InputVariants, InputProps['borderColor']> = {
  valid: 'buttonSecondaryBorder',
  error: 'error',
  default: 'teal',
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

  const variantType = useMemo(
    () => (error ? 'error' : isValid ? 'valid' : 'default'),
    [error, isValid]
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
          {isRequired ? 'required' : ''}
        </Text>
      </Container>
      <Container backgroundColor="black">
        <Input
          {...baseInputProps}
          {...inputProps}
          borderColor={borderColorMap[variantType]}
          iconProps={iconPropsMap[variantType]}
          paddingRight={iconPropsMap[variantType] ? 8 : 5}
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

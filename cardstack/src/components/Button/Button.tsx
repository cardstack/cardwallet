import {
  createRestyleComponent,
  createVariant,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
  VariantProps,
  border,
  BorderProps,
} from '@shopify/restyle';
import { ActivityIndicator } from 'react-native';
import React, { ReactNode } from 'react';

import { Text } from '../Text';
import { Container } from '../Container';
import { Icon, IconProps } from '../Icon';
import { AnimatedPressable } from '../AnimatedPressable';
import { useVariantValue } from '@cardstack/utils';
import { Theme } from '@cardstack/theme';

type RestyleProps = VariantProps<Theme, 'buttonVariants'> &
  LayoutProps<Theme> &
  BorderProps<Theme> &
  SpacingProps<Theme>;

type ButtonWrappper = 'fragment' | 'container';

interface ButtonProps extends RestyleProps {
  children: ReactNode;
  disabled?: boolean;
  iconProps?: IconProps;
  iconPosition?: IconPosition;
  small?: boolean;
  onPress?: () => void;
  loading?: boolean;
  wrapper?: ButtonWrappper;
  disablePress?: boolean;
  testID?: string;
}

type IconPosition = 'left' | 'right';

const VariantRestyleComponent = createVariant({
  themeKey: 'buttonVariants',
});

const AnimatedButton = createRestyleComponent<ButtonProps, Theme>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [layout, spacing, border, VariantRestyleComponent],
  AnimatedPressable
);

/**
 * A button with a simple press animation
 */
export const Button = ({
  children,
  iconProps,
  disabled,
  disablePress = false,
  iconPosition = 'left',
  loading,
  onPress,
  ...props
}: ButtonProps) => {
  const textStyle = useVariantValue(
    'buttonVariants',
    'textStyle',
    props.variant
  );

  const disabledTextStyle = useVariantValue(
    'buttonVariants',
    'disabledTextStyle',
    props.variant
  );

  const disabledTextProps = disabled ? disabledTextStyle : {};

  return (
    <AnimatedButton
      {...props}
      disabled={disabled || disablePress}
      onPress={onPress}
      variant={disabled ? 'disabledBlack' : props.variant}
      maxWidth={props.maxWidth || '100%'}
    >
      {loading ? (
        <ActivityIndicator testID="button-loading" />
      ) : (
        <Container
          flexDirection={iconPosition === 'left' ? 'row' : 'row-reverse'}
          justifyContent="center"
          alignItems="center"
        >
          {iconProps && (
            <Icon
              color={disabled ? 'blueText' : 'black'}
              iconSize="medium"
              marginRight={iconPosition === 'left' ? 3 : 0}
              {...iconProps}
            />
          )}
          <Text {...textStyle} {...disabledTextProps} allowFontScaling={false}>
            {children}
          </Text>
        </Container>
      )}
    </AnimatedButton>
  );
};

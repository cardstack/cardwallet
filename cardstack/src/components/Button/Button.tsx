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
  backgroundColor,
} from '@shopify/restyle';
import { ActivityIndicator, StyleSheet } from 'react-native';
import React, { ReactNode, useMemo } from 'react';

import { Text } from '../Text';
import { Container } from '../Container';
import { Icon, IconProps } from '../Icon';
import { AnimatedPressable } from '../AnimatedPressable';
import { useVariantStyle, useVariantValue } from '@cardstack/utils';
import { Theme } from '@cardstack/theme';

type RestyleProps = VariantProps<Theme, 'buttonVariants'> &
  LayoutProps<Theme> &
  BorderProps<Theme> &
  SpacingProps<Theme>;

interface ButtonProps extends RestyleProps {
  children: ReactNode;
  disabled?: boolean;
  iconProps?: IconProps;
  iconPosition?: IconPosition;
  small?: boolean;
  onPress?: () => void;
  loading?: boolean;
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
  [layout, spacing, border, VariantRestyleComponent, backgroundColor],
  AnimatedPressable
);

const styles = StyleSheet.create({
  // Ensures button's title size integrity if button's height gets to be manually set.
  title: {
    height: '100%',
  },
});

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

  const { variantStyles: disabledVariantStyles } = useVariantStyle(
    'buttonVariants',
    'disabledBlack'
  );

  const { mergedStyles } = useVariantStyle('buttonVariants', props.variant);

  const variantMergedStyles = useMemo(
    () => ({
      ...mergedStyles,
      ...(disabled ? { ...disabledVariantStyles } : {}),
    }),
    [disabled, disabledVariantStyles, mergedStyles]
  );

  const disabledTextProps = disabled ? disabledTextStyle : {};

  return (
    <AnimatedButton
      {...variantMergedStyles}
      {...props}
      disabled={disabled || disablePress}
      onPress={onPress}
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
          <Text
            {...textStyle}
            {...disabledTextProps}
            style={styles.title}
            allowFontScaling={false}
          >
            {children}
          </Text>
        </Container>
      )}
    </AnimatedButton>
  );
};

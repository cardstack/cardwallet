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
  opacity,
} from '@shopify/restyle';
import React, { ReactNode, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Theme } from '@cardstack/theme';
import { useVariantStyle, useVariantValue } from '@cardstack/utils';

import { AnimatedPressable } from '../AnimatedPressable';
import { Container } from '../Container';
import { Icon, IconProps } from '../Icon';
import { Text } from '../Text';

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
  onLongPress?: () => void;
  loading?: boolean;
  blocked?: boolean;
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
  [layout, spacing, border, opacity, VariantRestyleComponent, backgroundColor],
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
  blocked,
  onPress,
  onLongPress,
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
      opacity: blocked ? 0.35 : 1.0,
    }),
    [disabled, blocked, disabledVariantStyles, mergedStyles]
  );

  const disabledTextProps = disabled ? disabledTextStyle : {};

  return (
    <AnimatedButton
      {...variantMergedStyles}
      {...props}
      disabled={disabled || disablePress || loading || blocked}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {loading ? (
        <Container>
          <ActivityIndicator testID="button-loading" />
        </Container>
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
              marginLeft={iconPosition === 'right' ? 2 : 0}
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

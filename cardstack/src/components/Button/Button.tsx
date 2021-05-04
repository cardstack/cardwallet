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

import ButtonPressAnimation from '../../../../src/components/animations/ButtonPressAnimation';
import { Text } from '../Text';
import { Container } from '../Container';
import { Icon, IconProps } from '../Icon';
import { useVariantValue } from '@cardstack/utils';
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
}

type IconPosition = 'left' | 'right';

const VariantRestyleComponent = createVariant({
  themeKey: 'buttonVariants',
});

const AnimatedButton = createRestyleComponent<ButtonProps, Theme>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  [layout, spacing, border, VariantRestyleComponent],
  ButtonPressAnimation
);

/**
 * A button with a simple press animation
 */
export const Button = ({
  children,
  disabled,
  iconProps,
  iconPosition = 'left',
  loading,
  ...props
}: ButtonProps) => {
  const width = useVariantValue('buttonVariants', 'width', props.variant);
  const maxWidth = useVariantValue('buttonVariants', 'maxWidth', props.variant);

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
    <Container backgroundColor="transparent" {...props} flex={-1}>
      <AnimatedButton alignItems="center" disabled={disabled} {...props}>
        {loading ? (
          <ActivityIndicator testID="button-loading" />
        ) : (
          <Container
            flexDirection={iconPosition === 'left' ? 'row' : 'row-reverse'}
          >
            {iconProps && (
              <Icon
                color={disabled ? 'blueText' : 'black'}
                iconSize="medium"
                {...iconProps}
              />
            )}
            <Text {...textStyle} {...disabledTextProps}>
              {children}
            </Text>
          </Container>
        )}
      </AnimatedButton>
      {disabled && (
        <Container
          backgroundColor="black"
          top={0}
          left={0}
          borderRadius={100}
          opacity={0.25}
          position="absolute"
          height="100%"
          zIndex={1}
          width={width}
          maxWidth={maxWidth}
          testID="disabledOverlay"
        />
      )}
    </Container>
  );
};

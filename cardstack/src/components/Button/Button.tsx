import {
  createRestyleComponent,
  createVariant,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
  VariantProps,
} from '@shopify/restyle';
import React, { ReactNode } from 'react';

import ButtonPressAnimation from '../../../../src/components/animations/ButtonPressAnimation';
import { Text } from '../Text';
import { Container } from '../Container';
import { useVariantValue } from '@cardstack/utils';
import { Theme } from '@cardstack/theme';

type RestyleProps = VariantProps<Theme, 'buttonVariants'> &
  LayoutProps<Theme> &
  SpacingProps<Theme>;
interface ButtonProps extends RestyleProps {
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  small?: boolean;
  onPress?: () => void;
}

const VariantRestyleComponent = createVariant({
  themeKey: 'buttonVariants',
});

const AnimatedButton = createRestyleComponent<ButtonProps, Theme>(
  [layout, spacing, VariantRestyleComponent],
  ButtonPressAnimation
);

/**
 * A button with a simple press animation
 */
export const Button = ({ children, icon, disabled, ...props }: ButtonProps) => {
  const width = useVariantValue('buttonVariants', 'width', props.variant);
  const maxWidth = useVariantValue('buttonVariants', 'maxWidth', props.variant);

  const textStyle = useVariantValue(
    'buttonVariants',
    'textStyle',
    props.variant
  );

  const disabledTextProps = disabled
    ? {
        color: 'blueText',
      }
    : {};

  return (
    <Container backgroundColor="transparent">
      <AnimatedButton alignItems="center" disabled={disabled} {...props}>
        {icon}
        <Text {...textStyle} {...disabledTextProps}>
          {children}
        </Text>
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
        />
      )}
    </Container>
  );
};

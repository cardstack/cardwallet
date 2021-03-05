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
import { screenWidth, useVariantValue } from '@cardstack/utils';
import { Theme } from '@cardstack/theme';

type RestyleProps = VariantProps<Theme, 'buttonVariants'> &
  LayoutProps<Theme> &
  SpacingProps<Theme>;
interface ButtonProps extends RestyleProps {
  children: ReactNode;
  icon?: ReactNode;
  small?: boolean;
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
export const Button = ({ children, icon, small, ...props }: ButtonProps) => {
  const textStyle = useVariantValue(
    'buttonVariants',
    'textStyle',
    props.variant
  );

  const smallProps = small
    ? {
        width: (screenWidth - 48) / 2,
      }
    : {};

  return (
    <AnimatedButton alignItems="center" {...smallProps} {...props}>
      {icon}
      <Text {...textStyle}>{children}</Text>
    </AnimatedButton>
  );
};

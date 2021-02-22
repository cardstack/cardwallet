import {
  createRestyleComponent,
  createVariant,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
  VariantProps,
} from '@shopify/restyle';
import React, { FC } from 'react';

import ButtonPressAnimation from '../../../src/components/animations/ButtonPressAnimation';
import { Theme } from '../../theme';
import { Text } from '../Text';

type RestyleProps = VariantProps<Theme, 'buttonVariants'> &
  LayoutProps<Theme> &
  SpacingProps<Theme>;
interface IButtonProps extends RestyleProps {}

const VariantRestyleComponent = createVariant({
  themeKey: 'buttonVariants',
});

const AnimatedButton = createRestyleComponent<IButtonProps, Theme>(
  [layout, spacing, VariantRestyleComponent],
  ButtonPressAnimation
);

export const Button: FC<IButtonProps> = ({ children, ...props }) => (
  <AnimatedButton {...props}>
    <Text fontWeight="bold" variant="body">
      {children}
    </Text>
  </AnimatedButton>
);

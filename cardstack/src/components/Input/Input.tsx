import React from 'react';
import {
  createRestyleComponent,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
  position,
  PositionProps,
  typography,
  TypographyProps,
} from '@shopify/restyle';

import { TextInput, TextInputProps } from 'react-native';

import { Theme } from '../../theme';

type InputProps = TextInputProps &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  TypographyProps<Theme> &
  PositionProps<Theme>;

const BasicInput = createRestyleComponent<InputProps, Theme>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  [layout, spacing, position, typography],
  TextInput
);

/**
 * This is our primitive Input component with restyle props applied
 */
export const Input = React.forwardRef((props: InputProps, ref) => (
  <BasicInput
    fontFamily="OpenSans-Regular"
    fontSize={16}
    textContentType="none"
    ref={ref}
    {...props}
  />
));

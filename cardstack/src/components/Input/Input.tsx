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
  border,
  BorderProps,
  color,
  ColorProps,
} from '@shopify/restyle';

import { TextInput, TextInputProps } from 'react-native';

import { Theme } from '../../theme';
import { Icon, IconProps } from '../Icon';
import { Container } from '../Container';

type BaseInputProps = TextInputProps &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  TypographyProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  PositionProps<Theme>;

const BasicInput = createRestyleComponent<BaseInputProps, Theme>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  [layout, spacing, position, typography, border, color],
  TextInput
);

interface InputProps {
  border?: boolean;
  iconProps?: IconProps | null;
}

/**
 * This is our primitive Input component with restyle props applied
 */
export const Input = React.forwardRef((props: InputProps, ref) => (
  <Container>
    <BasicInput
      {...(props.border
        ? {
            borderType: 'solid',
            borderWidth: 1,
            borderColor: 'buttonSecondaryBorder',
            borderRadius: 100,
            paddingHorizontal: 5,
            paddingVertical: 3,
          }
        : {})}
      fontFamily="OpenSans-Regular"
      fontSize={16}
      textContentType="none"
      ref={ref}
      {...props}
    />
    {props.iconProps && (
      <Icon
        position="absolute"
        iconSize="medium"
        right={20}
        top={20}
        {...props.iconProps}
      />
    )}
  </Container>
));

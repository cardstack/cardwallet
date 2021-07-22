import {
  createRestyleComponent,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
  position,
  PositionProps,
  border,
  BorderProps,
} from '@shopify/restyle';
import { ReactNode } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { Theme } from '../../theme';

type RestyleProps = TouchableOpacityProps &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  PositionProps<Theme> &
  BorderProps<Theme>;

export interface TouchableProps extends RestyleProps {
  children: ReactNode;
}

/**
 * This is our primitive TouchableOpacity component with restyle props applied
 */
export const Touchable = createRestyleComponent<TouchableProps, Theme>(
  // eslint-disable-next-line@typescript-eslint/ban-ts-comment
  // @ts-ignore
  [layout, spacing, position, border],
  TouchableOpacity
);

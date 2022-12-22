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
  backgroundColor,
  BackgroundColorProps,
} from '@shopify/restyle';
import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import {
  SafeAreaView as RNSafeAreaContextView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

import { Theme } from '../../theme';

type RestyleProps = ViewStyle &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  PositionProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  SafeAreaViewProps;

export interface RNSafeAreaContextViewProps extends RestyleProps {
  children: ReactNode;
}

/**
 * This is our primitive SafeAreaView component with restyle props applied
 */
export const SafeAreaView = createRestyleComponent<
  RNSafeAreaContextViewProps,
  Theme
>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [layout, spacing, position, border, backgroundColor],
  RNSafeAreaContextView
);

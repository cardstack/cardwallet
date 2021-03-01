import {
  createRestyleComponent,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
} from '@shopify/restyle';
import { ReactNode } from 'react';
import {
  ScrollView as ReactNativeScrollView,
  ScrollViewProps as ReactNativeScrollViewProps,
} from 'react-native';

import { Theme } from '../../theme';

type RestyleProps = ReactNativeScrollViewProps &
  LayoutProps<Theme> &
  SpacingProps<Theme>;

export interface ScrollViewProps extends RestyleProps {
  children: ReactNode;
}

/**
 * This is our primitive ScrollView component with restyle props applied
 */
export const ScrollView = createRestyleComponent<ScrollViewProps, Theme>(
  [layout, spacing],
  ReactNativeScrollView
);

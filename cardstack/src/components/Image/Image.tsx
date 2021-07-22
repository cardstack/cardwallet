import {
  createRestyleComponent,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
  PositionProps,
  position,
  BackgroundColorProps,
  backgroundColor,
} from '@shopify/restyle';
import {
  Image as ReactNativeImage,
  ImageProps as ReactNativeImageProps,
} from 'react-native';

import { Theme } from '../../theme';

type ImageProps = ReactNativeImageProps &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  PositionProps<Theme> &
  BackgroundColorProps<Theme>;

/**
 * This is our primitive Image component with restyle props applied
 */
export const Image = createRestyleComponent<ImageProps, Theme>(
  // eslint-disable-next-line@typescript-eslint/ban-ts-comment
  // @ts-ignore
  [layout, spacing, position, backgroundColor],
  ReactNativeImage
);

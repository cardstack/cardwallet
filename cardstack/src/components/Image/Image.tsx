import {
  createRestyleComponent,
  layout,
  LayoutProps,
  spacing,
  SpacingProps,
} from '@shopify/restyle';
import {
  Image as ReactNativeImage,
  ImageProps as ReactNativeImageProps,
} from 'react-native';

import { Theme } from '../../theme';

type ImageProps = ReactNativeImageProps &
  LayoutProps<Theme> &
  SpacingProps<Theme>;

/**
 * This is our primitive Image component with restyle props applied
 */
export const Image = createRestyleComponent<ImageProps, Theme>(
  [layout, spacing],
  ReactNativeImage
);

import {
  createRestyleComponent,
  createText,
  TextProps as ShopifyTextProps,
} from '@shopify/restyle';
import { ReactNode } from 'react';
import { TextProps as ReactNativeTextProps } from 'react-native';

import { Theme, CustomTextProps, customText } from '../../theme';

/**
 * Renders a Text component with @shopify/restyle functionality.
 */
export type TextProps = Omit<ShopifyTextProps<Theme>, 'fontWeight'> &
  ShopifyTextProps<Theme> &
  ReactNativeTextProps &
  CustomTextProps<Theme> & {
    children?: ReactNode;
  };

const BaseText = createText<Theme>();
BaseText.defaultProps = {
  allowFontScaling: false,
};

export const Text = createRestyleComponent<TextProps, Theme>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [customText],
  BaseText
);

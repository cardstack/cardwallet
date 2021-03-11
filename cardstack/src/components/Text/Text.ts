import { createText, TextProps as ShopifyTextProps } from '@shopify/restyle';

import { Theme } from '../../theme';

/**
 * Renders a Text component with @shopify/restyle functionality.
 */
export type TextProps = ShopifyTextProps<Theme>;

export const Text = createText<Theme>();

import { createBox } from '@shopify/restyle';
import { ComponentProps } from 'react';
import { Theme } from '@cardstack/theme';

/**
 * A primitive Box component, using our theme.
 */
export const Box = createBox<Theme>();
export type BoxProps = ComponentProps<typeof Box>;

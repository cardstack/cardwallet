import { BoxProps, createBox } from '@shopify/restyle';
import React from 'react';

import { Theme } from '../../theme';

export type ContainerProps = BoxProps<Theme> & {};

/**
 * Renders a View with @shopify/restyle functionality.
 */
export const Container = createBox<Theme>();

/**
 * Renders a container with children that are horizontally and vertically centered.
 */
export const CenteredContainer = (
  props: ContainerProps
): React.ReactElement => (
  <Container alignItems="center" justifyContent="center" {...props} />
);

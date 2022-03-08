import { BoxProps, createBox } from '@shopify/restyle';
import React from 'react';

import { Theme } from '../../theme';

/**
 * Renders a View with @shopify/restyle functionality.
 */
export const Container = createBox<Theme>();

export type ContainerProps = React.ComponentProps<typeof Container> &
  BoxProps<Theme>;

/**
 * Renders a container with children that are horizontally and vertically centered.
 */
export const CenteredContainer = (
  props: ContainerProps
): React.ReactElement => (
  <Container alignItems="center" justifyContent="center" {...props} />
);

/**
 * Renders a fullscreen container with  absolute positioning.
 */
export const AbsoluteFullScreenContainer = (
  props: ContainerProps
): React.ReactElement => (
  <Container position="absolute" height="100%" width="100%" {...props} />
);

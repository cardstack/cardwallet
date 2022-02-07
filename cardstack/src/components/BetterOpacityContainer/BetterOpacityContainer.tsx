import React, { ReactNode } from 'react';
import { ViewProps } from 'react-native';

import {
  LayoutProps,
  SpacingProps,
  PositionProps,
  BorderProps,
  BackgroundColorProps,
} from '@shopify/restyle';

import { Theme } from '../../theme';
import { Container } from '@cardstack/components';

type RestyleProps = ViewProps &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  PositionProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme>;

interface BetterOpacityContainerProps {
  children: ReactNode;
}

export const BetterOpacityContainer = ({
  children,
  ...rest
}: BetterOpacityContainerProps & RestyleProps) => (
  <Container
    needsOffscreenAlphaCompositing
    renderToHardwareTextureAndroid
    {...rest}
  >
    {children}
  </Container>
);

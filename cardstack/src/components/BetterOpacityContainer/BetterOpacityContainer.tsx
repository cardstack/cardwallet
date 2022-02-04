/**
 * This Wrap is specificly to solve an Android issue where opacity of several stacked
 * views blend badly together, which in our case, was occuring on all list row components.
 * It only wraps a simple Container component and adds props `needsOffscreenAlphaCompositing`
 * and `renderToHardwareTextureAndroid`.
 */

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
import React from 'react';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { useDimensions } from '../../hooks';

import { Container } from '@cardstack/components';
const StatusBarHeight = getStatusBarHeight(true);
export const HeaderHeight = 44;
export const HeaderHeightWithStatusBar = HeaderHeight + StatusBarHeight;

export default function Header({ children, ...props }) {
  const { width: deviceWidth } = useDimensions();
  return (
    <Container
      alignItems="flex-end"
      flexDirection="row"
      height={HeaderHeightWithStatusBar}
      justifyContent="space-between"
      width={deviceWidth}
      {...props}
    >
      {children}
    </Container>
  );
}

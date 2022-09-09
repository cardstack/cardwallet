import React, { memo } from 'react';

import { Container, SafeAreaView, ContainerProps } from '@cardstack/components';

export const NAV_HEADER_HEIGHT = 54;

const MainHeaderWrapper: React.FC<ContainerProps> = ({
  children,
  backgroundColor = 'backgroundBlue',
  ...props
}) => (
  <SafeAreaView backgroundColor={backgroundColor} edges={['top']}>
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      height={NAV_HEADER_HEIGHT}
      paddingHorizontal={5}
      {...props}
    >
      {children}
    </Container>
  </SafeAreaView>
);

export default memo(MainHeaderWrapper);

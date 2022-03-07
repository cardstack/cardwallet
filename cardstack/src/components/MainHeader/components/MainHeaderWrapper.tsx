import React, { memo } from 'react';

import { Container, SafeAreaView, ContainerProps } from '@cardstack/components';

import { Device } from '@cardstack/utils';

const MainHeaderWrapper: React.FC<ContainerProps> = ({
  children,
  ...props
}) => (
  <SafeAreaView backgroundColor="backgroundBlue">
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingTop={Device.isAndroid ? 3 : 0}
      paddingBottom={2}
      paddingHorizontal={5}
      {...props}
    >
      {children}
    </Container>
  </SafeAreaView>
);

export default memo(MainHeaderWrapper);

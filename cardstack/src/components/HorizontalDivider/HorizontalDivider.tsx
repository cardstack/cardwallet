import React from 'react';

import { Container } from '@cardstack/components';

import { ContainerProps } from '../Container';

export const HorizontalDivider = (props: ContainerProps) => (
  <Container
    marginVertical={4}
    height={1}
    backgroundColor="borderGray"
    width="100%"
    {...props}
  />
);

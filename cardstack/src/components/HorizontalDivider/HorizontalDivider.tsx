import React from 'react';
import { ContainerProps } from '../Container';
import { Container } from '@cardstack/components';

export const HorizontalDivider = (props: ContainerProps) => (
  <Container
    marginVertical={4}
    height={1}
    backgroundColor="borderGray"
    width="100%"
    {...props}
  />
);

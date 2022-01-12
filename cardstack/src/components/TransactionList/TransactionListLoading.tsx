import React from 'react';

import { ContainerProps } from '../Container';
import { Container, Skeleton } from '@cardstack/components';

const TransactionsSection = ({
  light,
  ...props
}: ContainerProps & { light?: boolean }) => (
  <Container {...props}>
    <Skeleton light={light} width="50%" />
    <Skeleton light={light} height={75} width="100%" marginTop={3} />
    <Skeleton light={light} height={75} width="100%" marginTop={3} />
    <Skeleton light={light} height={75} width="100%" marginTop={3} />
  </Container>
);

export const TransactionListLoading = ({
  light,
  removePadding,
}: {
  removePadding?: boolean;
  light?: boolean;
}) => (
  <Container padding={removePadding ? 0 : 5} width="100%">
    <TransactionsSection light={light} />
    <TransactionsSection light={light} marginTop={7} />
  </Container>
);

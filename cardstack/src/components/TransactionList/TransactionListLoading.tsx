import React from 'react';

import { ContainerProps } from '../Container';
import { Container, Skeleton } from '@cardstack/components';

const TransactionsSection = (props: ContainerProps) => (
  <Container {...props}>
    <Skeleton width="50%" />
    <Skeleton height={75} width="100%" marginTop={3} />
    <Skeleton height={75} width="100%" marginTop={3} />
    <Skeleton height={75} width="100%" marginTop={3} />
  </Container>
);

export const TransactionListLoading = () => (
  <Container padding={4}>
    <TransactionsSection />
    <TransactionsSection marginTop={7} />
  </Container>
);

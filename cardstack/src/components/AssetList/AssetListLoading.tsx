import React from 'react';
import { ContainerProps } from '../Container';
import { Container, Skeleton, ScrollView } from '@cardstack/components';

const PrepaidCardSection = (props: ContainerProps) => (
  <Container {...props}>
    <Skeleton width="50%" />
    <Skeleton height={200} width="100%" marginTop={3} />
  </Container>
);

const BalancesSection = (props: ContainerProps) => (
  <Container {...props}>
    <Skeleton width="50%" />
    <Skeleton height={75} width="100%" marginTop={3} />
    <Skeleton height={75} width="100%" marginTop={3} />
  </Container>
);

const CollectiblesSection = (props: ContainerProps) => (
  <Container {...props}>
    <Skeleton width="50%" />
    <Skeleton height={125} width="100%" marginTop={3} />
  </Container>
);

export const AssetListLoading = () => (
  <ScrollView padding={4} flex={1}>
    <PrepaidCardSection />
    <PrepaidCardSection marginTop={7} />
    <BalancesSection marginTop={7} />
    <CollectiblesSection marginTop={7} />
  </ScrollView>
);

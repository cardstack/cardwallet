import React from 'react';
import { Container, Skeleton } from '@cardstack/components';

const Header = () => (
  <Container flexDirection="row" justifyContent="space-between">
    <Skeleton width="65%" />
    <Skeleton width="15%" />
  </Container>
);

const AssetItem = () => (
  <Container flexDirection="row" marginTop={6} justifyContent="space-between">
    <Container width="70%" flexDirection="row" alignItems="center">
      <Skeleton borderRadius={100} height={45} width={45} marginRight={2} />
      <Container flexDirection="column" width="70%">
        <Skeleton marginBottom={2} />
        <Skeleton width="75%" />
      </Container>
    </Container>
    <Container flexDirection="column" width="30%" alignItems="flex-end">
      <Skeleton marginBottom={2} />
      <Skeleton width="75%" />
    </Container>
  </Container>
);

const AssetSection = () => (
  <Container padding={4} width="100%" marginTop={4}>
    <Header />
    <AssetItem />
    <AssetItem />
    <AssetItem />
  </Container>
);

export const AssetListLoading = () => (
  <Container>
    <AssetSection />
    <AssetSection />
  </Container>
);

import React from 'react';

import { Container, Skeleton, HorizontalDivider } from '@cardstack/components';

import { SectionHeaderText } from './SectionHeaderText';

export const ProfileSectionSkeleton = ({ headerText = '' }) => (
  <>
    <SectionHeaderText>{headerText}</SectionHeaderText>
    <Container flexDirection="row" marginTop={5} marginLeft={2}>
      <Skeleton width="8%" height={18} light marginRight={4} borderRadius={7} />
      <Skeleton width="35%" height={18} light />
    </Container>
    <HorizontalDivider />
  </>
);

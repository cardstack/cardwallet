import React, { memo } from 'react';

import { Container, Skeleton } from '@cardstack/components';
import { HorizontalDivider } from '@cardstack/components/HorizontalDivider';

import { SectionHeaderText } from '../SectionHeaderText';

const PrepaidCardSectionSkeleton = ({ headerText }: { headerText: string }) => (
  <>
    <SectionHeaderText>{headerText}</SectionHeaderText>
    <Container flexDirection="row" marginTop={5} marginLeft={2}>
      <Skeleton
        width="8%"
        height={18}
        light
        marginBottom={3}
        marginRight={4}
        borderRadius={7}
      />
      <Skeleton width="35%" height={35} light marginBottom={2} />
    </Container>
    <Container paddingLeft={12}>
      <Skeleton width="60%" height={40} light marginBottom={4} />
      <Skeleton width="50%" height={30} light marginBottom={1} />
    </Container>
    <HorizontalDivider />
  </>
);

export default memo(PrepaidCardSectionSkeleton);

import React, { memo } from 'react';

import {
  CenteredContainer,
  ContainerProps,
  Skeleton,
} from '@cardstack/components';

export const RewardLoadingSkeleton = (props: ContainerProps) => (
  <CenteredContainer
    padding={5}
    justifyContent="space-between"
    flex={0.6}
    {...props}
  >
    <Skeleton height="5%" light width="75%" borderRadius={5} />
    <Skeleton height="28%" light />
    <Skeleton height="50%" light />
  </CenteredContainer>
);

export default memo(RewardLoadingSkeleton);

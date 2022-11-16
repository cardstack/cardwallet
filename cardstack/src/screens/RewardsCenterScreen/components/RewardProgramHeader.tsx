import React, { memo } from 'react';

import { CenteredContainer, Image, Text } from '@cardstack/components';

import rewardBanner from '../../../assets/rewards-promo.png';

export const RewardProgramHeader = memo(({ title }: { title?: string }) => (
  <CenteredContainer>
    <Image source={rewardBanner} minWidth="100%" />
    {!!title && (
      <CenteredContainer position="absolute" width="60%" height="100%">
        <Text color="white" variant="promoBannerTitle">
          {title}
        </Text>
      </CenteredContainer>
    )}
  </CenteredContainer>
));

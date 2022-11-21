import React, { memo } from 'react';

import { CenteredContainer, Image, Text } from '@cardstack/components';

import cardstackRewardBanner from '../../../assets/rewards-banner.png';
import bannerBackground from '../../../assets/rewards-promo.png';

export const RewardProgramHeader = memo(({ title }: { title?: string }) => (
  <CenteredContainer>
    {title ? (
      <>
        <Image source={bannerBackground} minWidth="100%" />
        <CenteredContainer position="absolute" width="60%" height="100%">
          <Text
            color="white"
            variant="semibold"
            fontSize={12}
            textTransform="uppercase"
            textAlign="center"
          >
            {title}
          </Text>
        </CenteredContainer>
      </>
    ) : (
      <Image source={cardstackRewardBanner} minWidth="100%" />
    )}
  </CenteredContainer>
));

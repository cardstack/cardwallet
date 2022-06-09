import React, { memo } from 'react';

import { Container, ContainerProps, Image, Text } from '@cardstack/components';

import rewardsPromoBanner from '../../assets/rewards-promo.png';
import { Button } from '../Button';
import { CenteredContainer } from '../Container';

import useRewardsPromoBanner from './useRewardsPromoBanner';

interface RewardsPromoBannerProps extends ContainerProps {
  hasUnclaimedRewards: boolean;
}

const RewardsPromoBanner = ({
  hasUnclaimedRewards,
  ...containerProps
}: RewardsPromoBannerProps) => {
  const { onPress, title, btnLabel } = useRewardsPromoBanner(
    hasUnclaimedRewards
  );

  return (
    <Container {...containerProps}>
      <Image
        alignSelf="center"
        overflow="hidden"
        borderRadius={10}
        maxWidth="90%"
        source={rewardsPromoBanner}
      />
      <CenteredContainer position="absolute" bottom="15%" left={0} right={0}>
        <CenteredContainer maxWidth="50%">
          <Text
            fontSize={12}
            fontWeight="700"
            letterSpacing={1.2}
            color="white"
            marginBottom={4}
            textTransform="uppercase"
            textAlign="center"
          >
            {title}
          </Text>
        </CenteredContainer>
        <Button onPress={onPress} variant="small" height={30}>
          <Text fontSize={13} fontWeight="600">
            {btnLabel}
          </Text>
        </Button>
      </CenteredContainer>
    </Container>
  );
};

export default memo(RewardsPromoBanner);

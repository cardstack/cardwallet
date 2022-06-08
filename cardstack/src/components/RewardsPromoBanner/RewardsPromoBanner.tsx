import React, { memo } from 'react';

import { Container, ContainerProps, Image, Text } from '@cardstack/components';

import { Button } from '../Button';
import { CenteredContainer } from '../Container';

import useRewardsPromoBanner from './useRewardsPromoBanner';

const RewardsPromoBanner = ({ ...props }: ContainerProps) => {
  const {
    onPress,
    bannerSource,
    buttonLabel,
    buttonIcon,
  } = useRewardsPromoBanner();

  return (
    <Container {...props}>
      <Image
        alignSelf="center"
        overflow="hidden"
        borderRadius={10}
        maxWidth="90%"
        source={bannerSource}
      />
      <CenteredContainer position="absolute" bottom="15%" left={0} right={0}>
        <Button
          onPress={onPress}
          variant="small"
          height={30}
          iconProps={buttonIcon}
          iconPosition="right"
        >
          <Text fontSize={13} fontWeight="600">
            {buttonLabel}
          </Text>
        </Button>
      </CenteredContainer>
    </Container>
  );
};

export default memo(RewardsPromoBanner);

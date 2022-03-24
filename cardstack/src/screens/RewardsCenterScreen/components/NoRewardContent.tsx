import React from 'react';
import { strings } from '../strings';
import { RewardsTitle } from '.';
import {
  Container,
  ContainerProps,
  InfoBanner,
  Text,
} from '@cardstack/components';

export const NoRewardContent = () => (
  <Container alignItems="center" padding={5}>
    <RewardsTitle title={strings.register.noRewards.title} paddingBottom={5} />
    <NoRewardMessage paddingBottom={4} />
    <InfoBanner
      title={strings.register.infobanner.title}
      message={strings.register.infobanner.message}
    />
  </Container>
);

const NoRewardMessage = (props: ContainerProps) => (
  <Container width="100%" {...props}>
    <Container
      padding={8}
      alignItems="center"
      borderColor="borderLightColor"
      borderWidth={1}
      borderRadius={10}
    >
      <Text weight="bold" size="body" paddingLeft={2} textAlign="center">
        {strings.register.noRewards.message}
      </Text>
    </Container>
  </Container>
);

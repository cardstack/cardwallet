import React from 'react';
import { ImageSourcePropType } from 'react-native';

import chevronRight from '../../assets/icons/chevron-right.png';
import payIcon from '../../assets/icons/pay.png';
import reloadIcon from '../../assets/icons/reload.png';
import rewardIcon from '../../assets/icons/gift.png';
import { Container, Button, Text, Icon } from '@cardstack/components';

export const ExpandedCard = () => (
  <Container
    width="100%"
    backgroundColor="white"
    height="100%"
    marginVertical={2}
    padding={4}
    borderRadius={10}
  >
    <Button>Reload</Button>
    <Text fontSize={20} marginVertical={6}>
      Features
    </Text>
    <Text variant="subHeader">You can do the following:</Text>
    <Container
      backgroundColor="grayBackground"
      width="100%"
      marginTop={3}
      borderRadius={10}
      padding={4}
    >
      <OptionItem
        source={payIcon}
        boldText="Pay merchants"
        bodyText=" with this card"
      />
      <OptionItem source={reloadIcon} boldText="Reload" bodyText=" this card" />
      <OptionItem
        source={rewardIcon}
        boldText="Earn rewards"
        bodyText=" with this card"
      />
    </Container>
  </Container>
);

interface OptionItemProps {
  source: ImageSourcePropType;
  boldText: string;
  bodyText: string;
}

const OptionItem = ({ source, boldText, bodyText }: OptionItemProps) => (
  <Container
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    marginVertical={3}
  >
    <Container flexDirection="row" marginRight={3} alignItems="center">
      <Icon source={source} />
      <Text fontSize={14} fontWeight="700">
        {boldText}
      </Text>
      <Text fontSize={14}>{bodyText}</Text>
    </Container>
    <Icon source={chevronRight} size={15} />
  </Container>
);

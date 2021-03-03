import React from 'react';
import { ImageSourcePropType, SectionList } from 'react-native';

import chevronRight from '../../assets/icons/chevron-right.png';
import payIcon from '../../assets/icons/pay.png';
import reloadIcon from '../../assets/icons/reload.png';
import rewardIcon from '../../assets/icons/gift.png';
import {
  Container,
  Button,
  Text,
  Icon,
  TransactionCoinRowProps,
  TransactionCoinRow,
} from '@cardstack/components';

export interface ExpandedCardProps {
  recentActivity: {
    title: string;
    data: TransactionCoinRowProps[];
  }[];
}

export const ExpandedCard = (props: ExpandedCardProps) => (
  <Container
    width="100%"
    backgroundColor="white"
    height="100%"
    marginVertical={2}
    padding={4}
    borderRadius={10}
    testID="expanded-card"
  >
    <Container width="100%" alignItems="center">
      <Button>Reload</Button>
    </Container>
    <Features />
    <RecentActivity {...props} />
  </Container>
);

const Features = () => (
  <>
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
  </>
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

const RecentActivity = (props: ExpandedCardProps) => (
  <>
    <Text fontSize={20} marginVertical={6}>
      Recent Activity
    </Text>
    <SectionList
      keyExtractor={(item, index) =>
        (item.transactionAmount + index).toString()
      }
      sections={props.recentActivity}
      renderItem={({ item }) => <TransactionCoinRow {...item} />}
      renderSectionHeader={({ section: { title } }) => (
        <Text variant="subHeader" marginTop={4}>
          {title}
        </Text>
      )}
    />
  </>
);

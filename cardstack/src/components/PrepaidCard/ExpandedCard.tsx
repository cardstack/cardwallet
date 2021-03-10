import React from 'react';
import { SectionList } from 'react-native';
import { TransactionItem } from '../../types';
import {
  Button,
  Container,
  Icon,
  Text,
  TransactionCoinRow,
} from '@cardstack/components';

export interface ExpandedCardProps {
  recentActivity: {
    title: string;
    data: TransactionItem[];
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
        iconName="pay"
        boldText="Pay merchants"
        bodyText=" with this card"
      />
      <OptionItem iconName="reload" boldText="Reload" bodyText=" this card" />
      <OptionItem
        iconName="gift"
        boldText="Earn rewards"
        bodyText=" with this card"
      />
    </Container>
  </>
);

interface OptionItemProps {
  iconName: string;
  boldText: string;
  bodyText: string;
}

const OptionItem = ({ iconName, boldText, bodyText }: OptionItemProps) => (
  <Container
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    marginVertical={3}
  >
    <Container flexDirection="row" marginRight={3} alignItems="center">
      <Icon name={iconName} color="black" marginRight={2} />
      <Text fontSize={14} fontWeight="700">
        {boldText}
      </Text>
      <Text fontSize={14}>{bodyText}</Text>
    </Container>
    <Icon name="chevron-right" iconSize="medium" color="black" />
  </Container>
);

const RecentActivity = (props: ExpandedCardProps) => (
  <>
    <Text fontSize={20} marginVertical={6}>
      Recent Activity
    </Text>
    <SectionList
      keyExtractor={item => item.hash}
      sections={props.recentActivity}
      renderItem={({ item }) => (
        <TransactionCoinRow item={item} paddingHorizontal={0} />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text variant="subHeader" marginTop={4}>
          {title}
        </Text>
      )}
    />
  </>
);

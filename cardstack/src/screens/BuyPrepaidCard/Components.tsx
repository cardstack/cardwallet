import React from 'react';
import { StyleSheet } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  Skeleton,
  Text,
} from '@cardstack/components';

export const TopContent = () => {
  return (
    <Container marginTop={4} marginBottom={6}>
      <Text fontSize={26} color="white">
        Buy a{' '}
        <Text fontSize={26} color="teal">
          Prepaid Card
        </Text>{' '}
        via Apple Pay to get started
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 2,
  },
});

export const CardLoaderSkeleton = () => (
  <Container {...styles.cardContainer}>
    <Skeleton height={100} />
  </Container>
);

export const CardContent = ({
  onPress,
  amount,
  isSelected,
  quantity,
}: {
  onPress: () => void;
  amount: number;
  isSelected: boolean;
  quantity: number;
}) => {
  const isSoldOut = quantity === 0;

  // Would like to useMemo with object, but typing it, bc restyle it's a bit cumbersome
  const borderColor = isSelected ? 'buttonPrimaryBorder' : 'borderBlue';
  const variant = isSelected ? 'squareSelected' : 'square';
  const titleColor = isSelected ? 'black' : 'white';

  return (
    <CenteredContainer {...styles.cardContainer}>
      <Button
        borderColor={isSoldOut ? 'buttonDisabledBackground' : borderColor}
        variant={isSoldOut ? 'squareDisabled' : variant}
        onPress={onPress}
        disablePress={isSoldOut}
      >
        <Container flexDirection="column">
          <Text
            color={isSoldOut ? 'blueText' : titleColor}
            fontSize={28}
            textAlign="center"
          >
            $ {amount}
          </Text>
          {isSoldOut && (
            <Text
              color="buttonSecondaryBorder"
              fontSize={14}
              textAlign="center"
            >
              SOLD OUT
            </Text>
          )}
        </Container>
      </Button>
    </CenteredContainer>
  );
};

export const Subtitle = ({ text }: { text: string }) => {
  return (
    <Text
      fontSize={13}
      color="underlineGray"
      weight="bold"
      marginBottom={2}
      letterSpacing={0.4}
    >
      {text}
    </Text>
  );
};

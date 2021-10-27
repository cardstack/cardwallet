import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Container, Skeleton, Text } from '@cardstack/components';

export const TopContent = () => {
  return (
    <Container marginTop={4}>
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
  faceValue,
  quantity,
}: {
  onPress: () => void;
  amount: number;
  faceValue: number;
  isSelected: boolean;
  quantity: number;
}) => {
  const isSoldOut = quantity === 0;

  // Would like to useMemo with object, but typing it, bc restyle it's a bit cumbersome
  const borderColor = isSelected ? 'buttonPrimaryBorder' : 'borderBlue';
  const variant = isSelected ? 'squareSelected' : 'square';
  const titleColor = isSelected ? 'black' : 'white';
  const subtitleColor = isSelected ? 'black' : 'buttonSecondaryBorder';

  return (
    <Button
      borderColor={isSoldOut ? 'buttonDisabledBackground' : borderColor}
      variant={isSoldOut ? 'squareDisabled' : variant}
      onPress={onPress}
      wrapper="fragment"
      disablePress={isSoldOut}
      {...styles.cardContainer}
    >
      <Text
        color={isSoldOut ? 'blueText' : titleColor}
        fontSize={28}
        textAlign="center"
      >
        $ {amount}
      </Text>
      <Text
        color={isSoldOut ? 'buttonSecondaryBorder' : subtitleColor}
        fontSize={14}
        textAlign="center"
        fontWeight="500"
      >
        {`\n`}
        {isSoldOut ? 'SOLD OUT' : `${faceValue} SPEND`}
      </Text>
    </Button>
  );
};

export const Subtitle = ({ text }: { text: string }) => {
  return (
    <Text
      fontSize={13}
      color="underlineGray"
      weight="bold"
      marginBottom={5}
      letterSpacing={0.4}
    >
      {text}
    </Text>
  );
};

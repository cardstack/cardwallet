import React from 'react';
import {
  Button,
  Container,
  ContainerProps,
  Skeleton,
  Text,
} from '@cardstack/components';

export const InventorySection = (props: ContainerProps) => (
  <Container {...props}>
    <Skeleton height={200} width="100%" marginTop={3} />
  </Container>
);

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

const baseStyles = {
  marginRight: 4,
  marginBottom: 3,
  borderRadius: 10,
  width: '100%',
};

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
  return quantity > 0 ? (
    <Button
      borderColor={isSelected ? 'buttonPrimaryBorder' : 'buttonSecondaryBorder'}
      variant={isSelected ? 'squareSelected' : 'square'}
      onPress={onPress}
      {...baseStyles}
    >
      <Text
        color={isSelected ? 'black' : 'white'}
        fontSize={28}
        textAlign="center"
      >
        $ {amount}
      </Text>
      <Text
        color={isSelected ? 'black' : 'white'}
        fontSize={14}
        textAlign="center"
        fontWeight="500"
      >
        {`\n`}
        {faceValue} SPEND
      </Text>
    </Button>
  ) : (
    <Button
      borderColor="buttonDisabledBackground"
      variant="squareDisabled"
      {...baseStyles}
    >
      <Text color="blueText" fontSize={28} textAlign="center">
        ${amount}
      </Text>
      <Text
        color="buttonSecondaryBorder"
        fontSize={13}
        textAlign="center"
        fontFamily="OpenSans-Semibold"
      >
        {`\n`}
        SOLD OUT
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

import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import {
  Button,
  Container,
  PrepaidCard,
  ScrollView,
  Text,
} from '@cardstack/components';
import ApplePayButton from '@rainbow-me/components/add-cash/ApplePayButton';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';

interface Card {
  amount: number;
  isSelected: boolean;
}

const TopContent = () => {
  return (
    <>
      <Text fontSize={26} color="white">
        Buy a{' '}
        <Text fontSize={26} color="teal">
          Prepaid Card
        </Text>{' '}
        via Apple Pay to get started
      </Text>
    </>
  );
};

const CardContent = ({
  onPress,
  amount,
  isSelected,
}: {
  onPress: () => void;
  amount: number;
  isSelected: boolean;
}) => {
  return (
    <Button
      borderColor={isSelected ? 'buttonPrimaryBorder' : 'buttonSecondaryBorder'}
      variant={isSelected ? 'squareSelected' : 'square'}
      width="100%"
      marginRight={4}
      marginBottom={3}
      borderRadius={4}
      onPress={onPress}
    >
      <Text
        color={isSelected ? 'black' : 'white'}
        fontSize={28}
        textAlign="center"
      >
        ${amount}
      </Text>
      <Text
        color={isSelected ? 'black' : 'white'}
        fontSize={14}
        textAlign="center"
        fontWeight="500"
      >
        {`\n`}
        {amount * 100} SPEND
      </Text>
    </Button>
  );
};

const Subtitle = ({ text }: { text: string }) => {
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

const BuyPrepaidCard = () => {
  const cardsList: Card[] = [
    { amount: 5, isSelected: true },
    { amount: 10, isSelected: false },
    { amount: 25, isSelected: false },
    { amount: 50, isSelected: false },
  ];

  const network = useRainbowSelector(state => state.settings.network);
  const address = getAddressByNetwork('prepaidCardManager', network);
  const [amount, setAmount] = useState<number>(5);
  const [cards, setCards] = useState<Card[]>(cardsList);

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  // const { results } = useInventories();

  // const onSkip = () => {
  //   navigate(Routes.SWIPE_LAYOUT, {
  //     screen: Routes.WALLET_SCREEN,
  //   });
  // };

  const onSelectCardCall = useCallback(
    (item, index) => {
      setAmount(item.amount);

      const modifiedCards = cards.map(card => {
        return { ...card, isSelected: false };
      });

      modifiedCards[index].isSelected = true;
      setCards(modifiedCards);
    },
    [cards]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <CardContent onPress={() => onSelectCardCall(item, index)} {...item} />
    ),
    [onSelectCardCall]
  );

  return (
    <Container backgroundColor="backgroundBlue" flex={1}>
      <Container marginTop={18} padding={4}>
        <TopContent />
      </Container>
      <ScrollView padding={5} flex={10}>
        <Container width="100%" marginBottom={8}>
          <Subtitle text="ENTER AMOUNT" />
          <FlatList data={cards} renderItem={renderItem} numColumns={2} />
        </Container>

        <Container width="100%" marginBottom={16}>
          <Subtitle text="PREVIEW" />
          <PrepaidCard
            networkName={network}
            nativeCurrency={nativeCurrency}
            currencyConversionRates={currencyConversionRates}
            address={address}
            issuer="Cardstack"
            issuingToken=""
            spendFaceValue={amount}
            tokens={[]}
            type="prepaid-card"
            reloadable={false}
            transferrable={false}
            cardCustomization={{
              background:
                'linear-gradient(139.27deg, #00ebe5 34%, #c3fc33 70%)',
              issuerName: 'Cardstack',
              patternColor: 'white',
              patternUrl:
                'https://app.cardstack.com/images/prepaid-card-customizations/pattern-5.svg',
              textColor: 'black',
            }}
          />
        </Container>
      </ScrollView>
      <Container
        padding={8}
        backgroundColor="grayButtonBackground"
        justifyContent="center"
      >
        <ApplePayButton
          disabled={true}
          onDisabledPress={() => console.log('onDisabledPress')}
          onSubmit={() => console.log('onSubmit')}
        />
      </Container>
    </Container>
  );
};

export default BuyPrepaidCard;

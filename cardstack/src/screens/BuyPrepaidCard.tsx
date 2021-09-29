import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import {
  Button,
  Container,
  PrepaidCard,
  ScrollView,
  Skeleton,
  Text,
} from '@cardstack/components';
import ApplePayButton from '@rainbow-me/components/add-cash/ApplePayButton';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import {
  Inventory,
  usePrepaidCardInventory,
} from '@cardstack/hooks/prepaid-card/usePrepaidCardInventory';
import {
  useCustodialWallet,
  usePrepaidCardReservation,
} from '@cardstack/hooks';

const Shimmer = () => {
  return (
    <Container>
      <Skeleton light height={100} width="100%" marginTop={3} />
    </Container>
  );
};

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
  faceValue,
}: {
  onPress: () => void;
  amount: number;
  faceValue: number;
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
        {faceValue} SPEND
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
  const network = useRainbowSelector(state => state.settings.network);
  const hubURL = 'https://hub-staging.stack.cards';

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const [card, setCard] = useState<Inventory>();

  const {
    inventoryData,
    setInventoryData,
    isLoading,
  } = usePrepaidCardInventory(hubURL);

  const { reservationData } = usePrepaidCardReservation(
    card?.attributes?.sku || '',
    hubURL
  );

  const { custodialWallet } = useCustodialWallet(hubURL);

  // const onSkip = () => {
  //   navigate(Routes.SWIPE_LAYOUT, {
  //     screen: Routes.WALLET_SCREEN,
  //   });
  // };

  console.log('reservationData: ', reservationData);
  console.log('custodialWallet: ', custodialWallet);

  const onSelectCard = useCallback(
    (item, index) => {
      const modifiedCards =
        inventoryData !== undefined
          ? inventoryData.map((cardItem: Inventory) => {
              return { ...cardItem, isSelected: false };
            })
          : [];

      modifiedCards[index].isSelected = true;
      setInventoryData(modifiedCards);
      setCard(
        modifiedCards.filter((cardItem: Inventory) => cardItem.isSelected)[0]
      );
    },
    [inventoryData, setInventoryData]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Inventory; index: number }) => (
      <CardContent
        onPress={() => onSelectCard(item, index)}
        isSelected={item.isSelected}
        amount={item.amount}
        faceValue={item.attributes['face-value']}
      />
    ),
    [onSelectCard]
  );

  return (
    <Container backgroundColor="backgroundBlue" flex={1}>
      <Container marginTop={18} padding={4}>
        <TopContent />
      </Container>
      <ScrollView padding={5} flex={10}>
        <Container width="100%" marginBottom={8}>
          <Subtitle text="ENTER AMOUNT" />
          {isLoading ? (
            <Shimmer />
          ) : (
            <FlatList
              data={inventoryData}
              renderItem={renderItem}
              numColumns={2}
            />
          )}
        </Container>

        {card ? (
          <Container width="100%" marginBottom={16}>
            <Subtitle text="PREVIEW" />
            <PrepaidCard
              networkName={network}
              nativeCurrency={nativeCurrency}
              currencyConversionRates={currencyConversionRates}
              address={card?.attributes['issuing-token-address']}
              issuer="Cardstack"
              issuingToken={card?.attributes['issuing-token-symbol']}
              spendFaceValue={card?.attributes['face-value'] || 0}
              tokens={[]}
              type="prepaid-card"
              reloadable={card?.attributes.reloadable}
              transferrable={card?.attributes.transferrable}
              cardCustomization={
                card?.attributes['customization-DID']
                  ? card?.attributes['customization-DID']
                  : {
                      background:
                        'linear-gradient(139.27deg, #00ebe5 34%, #c3fc33 70%)',
                      issuerName: 'Cardstack',
                      patternColor: 'white',
                      patternUrl:
                        'https://app.cardstack.com/images/prepaid-card-customizations/pattern-5.svg',
                      textColor: 'black',
                    }
              }
            />
          </Container>
        ) : null}
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

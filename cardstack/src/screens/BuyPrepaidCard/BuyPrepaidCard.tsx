import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import {
  CardContent,
  CardLoaderSkeleton,
  Subtitle,
  TopContent,
} from './Components';
import {
  Container,
  Icon,
  SheetHandle,
  Text,
  Touchable,
} from '@cardstack/components';
import ApplePayButton from '@rainbow-me/components/add-cash/ApplePayButton';
import { SlackSheet } from '@rainbow-me/components/sheet';
import { Inventory } from '@cardstack/services';
import { useBuyPrepaidCard } from '@rainbow-me/hooks';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';
import Routes from '@rainbow-me/routes';

const DEFAULT_CARD_CONFIG = {
  background: 'linear-gradient(139.27deg, #00ebe5 34%, #c3fc33 70%)',
  issuerName: 'Cardstack',
  patternColor: 'white',
  patternUrl:
    'https://app.cardstack.com/images/prepaid-card-customizations/pattern-5.svg',
  textColor: 'black',
};

const BuyPrepaidCard = () => {
  const {
    onSelectCard,
    card,
    handlePurchase,
    isInventoryLoading,
    inventoryData,
    network,
    nativeCurrency,
    currencyConversionRates,
  } = useBuyPrepaidCard();

  const { navigate } = useNavigation();

  const renderItem = useCallback(
    ({ item, index }: { item: Inventory; index: number }) =>
      isInventoryLoading || !item.attributes ? (
        <CardLoaderSkeleton />
      ) : (
        <CardContent
          onPress={() => onSelectCard(item, index)}
          isSelected={item?.isSelected}
          amount={item?.amount}
          faceValue={item?.attributes?.['face-value']}
          quantity={item.attributes?.quantity}
        />
      ),
    [isInventoryLoading, onSelectCard]
  );

  const onPressSupport = useCallback(
    () =>
      navigate(Routes.EXPANDED_ASSET_SHEET_DRILL, {
        type: 'supportAndFees',
      }),
    [navigate]
  );

  return (
    <Container backgroundColor="backgroundBlue" flex={1}>
      <SlackSheet
        backgroundColor="transparent"
        renderHeader={() => (
          <Container
            backgroundColor="backgroundBlue"
            paddingTop={16}
            paddingHorizontal={2}
            alignItems="center"
          >
            <SheetHandle />
            <TopContent />
          </Container>
        )}
        renderFooter={() => (
          <Container
            padding={8}
            backgroundColor="backgroundBlue"
            justifyContent="center"
          >
            <ApplePayButton
              disabled={card?.quantity === 0}
              onSubmit={handlePurchase}
              onDisabledPress={() => console.log('onDisablePress')}
            />
            <Touchable width="100%" onPress={onPressSupport}>
              <Container
                alignItems="center"
                padding={6}
                flexDirection="row"
                justifyContent="center"
              >
                <Text color="white" marginRight={1}>
                  Works with most debit cards
                </Text>
                <Icon name="info" size={15} />
              </Container>
            </Touchable>
          </Container>
        )}
        scrollEnabled
      >
        <Container backgroundColor="backgroundBlue" height="100%" flex={1}>
          <Container backgroundColor="backgroundBlue" width="100%" padding={4}>
            <Subtitle text="CHOOSE AMOUNT" />
            <FlatList
              data={inventoryData}
              renderItem={renderItem}
              numColumns={2}
            />
          </Container>
          {card ? (
            <Container marginBottom={16} padding={4}>
              <Subtitle text="PREVIEW" />
              <Container paddingHorizontal={10}>
                <MediumPrepaidCard
                  networkName={network}
                  nativeCurrency={nativeCurrency}
                  currencyConversionRates={currencyConversionRates}
                  address="0xXXXX…XXXX"
                  spendFaceValue={card['face-value'] || 0}
                  reloadable={card.reloadable}
                  transferrable={card.transferrable}
                  cardCustomization={
                    card.customizationDID
                      ? card.customizationDID
                      : DEFAULT_CARD_CONFIG
                  }
                />
              </Container>
            </Container>
          ) : null}
        </Container>
      </SlackSheet>
    </Container>
  );
};

export default BuyPrepaidCard;

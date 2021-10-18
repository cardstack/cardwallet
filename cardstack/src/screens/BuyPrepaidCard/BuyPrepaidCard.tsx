import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import {
  CardContent,
  InventorySection,
  Subtitle,
  TopContent,
} from './Components';
import { Container, SheetHandle } from '@cardstack/components';
import ApplePayButton from '@rainbow-me/components/add-cash/ApplePayButton';
import { SlackSheet } from '@rainbow-me/components/sheet';
import { Inventory } from '@cardstack/services';
import { useBuyPrepaidCard } from '@rainbow-me/hooks';
import { LoadingOverlay } from '@rainbow-me/components/modal';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';

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
    isLoading,
    card,
    handlePurchase,
    isInventoryLoading,
    inventoryData,
    network,
    nativeCurrency,
    currencyConversionRates,
  } = useBuyPrepaidCard();

  const renderItem = useCallback(
    ({ item, index }: { item: Inventory; index: number }) => (
      <CardContent
        onPress={() => onSelectCard(item, index)}
        isSelected={item?.isSelected}
        amount={item?.amount}
        faceValue={item?.attributes['face-value']}
        quantity={item.attributes?.quantity}
      />
    ),
    [onSelectCard]
  );

  return (
    <Container backgroundColor="backgroundBlue" flex={1}>
      {isLoading ? (
        <LoadingOverlay
          title={`Processing Transaction \nThis will take approximately \n10-15 seconds`}
        />
      ) : null}
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
            backgroundColor="grayButtonBackground"
            justifyContent="center"
          >
            <ApplePayButton
              disabled={Object.keys(card || {}).length === 0}
              onSubmit={handlePurchase}
              onDisabledPress={() => console.log('onDisablePress')}
            />
          </Container>
        )}
        scrollEnabled
      >
        <Container backgroundColor="backgroundBlue" height="100%" flex={1}>
          <Container backgroundColor="backgroundBlue" width="100%" padding={4}>
            <Subtitle text="CHOOSE AMOUNT" />
            {!isInventoryLoading ? (
              <FlatList
                data={inventoryData}
                renderItem={renderItem}
                numColumns={2}
              />
            ) : (
              <InventorySection />
            )}
          </Container>
          {card ? (
            <Container width="100%" marginBottom={16} padding={4}>
              <Subtitle text="PREVIEW" />
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
          ) : null}
        </Container>
      </SlackSheet>
    </Container>
  );
};

export default BuyPrepaidCard;

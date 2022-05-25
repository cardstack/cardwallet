import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';

import {
  Container,
  Icon,
  SheetHandle,
  Text,
  Touchable,
} from '@cardstack/components';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';
import { Routes } from '@cardstack/navigation';
import { Inventory } from '@cardstack/types';

import ApplePayButton from '@rainbow-me/components/add-cash/ApplePayButton';
import { SlackSheet } from '@rainbow-me/components/sheet';
import { useBuyPrepaidCard } from '@rainbow-me/hooks';

import {
  CardContent,
  CardLoaderSkeleton,
  Subtitle,
  TopContent,
} from './Components';

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
    isPurchaseInProgress,
    isInventoryLoading,
    inventoryData,
    network,
    nativeCurrencyInfo,
    nativeBalance,
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

  const onPressSupport = useCallback(() => navigate(Routes.SUPPORT_AND_FEES), [
    navigate,
  ]);

  const isDisabled =
    card?.quantity === 0 ||
    inventoryData?.length === 0 ||
    inventoryData?.filter(item => item?.isSelected).length === 0;

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
            {isDisabled ? null : (
              <ApplePayButton
                disabled={isPurchaseInProgress}
                onSubmit={handlePurchase}
                onDisabledPress={() => console.log('onDisablePress')}
              />
            )}
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
                  address="0xXXXX…XXXX"
                  nativeCurrencyInfo={nativeCurrencyInfo}
                  nativeBalance={nativeBalance}
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

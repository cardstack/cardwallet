import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';

import { Container, Icon, Sheet, Text, Touchable } from '@cardstack/components';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';
import { Routes } from '@cardstack/navigation';
import { colors } from '@cardstack/theme';
import { Inventory } from '@cardstack/types';

import ApplePayButton from '@rainbow-me/components/add-cash/ApplePayButton';
import { useBuyPrepaidCard } from '@rainbow-me/hooks';

import {
  CardContent,
  CardLoaderSkeleton,
  Subtitle,
  TopContent,
} from './Components';
import { strings } from './strings';

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

  // necessary to avoid rendering issues with the skeleton
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderFooter = useMemo(
    () => (
      <Container paddingHorizontal={2} justifyContent="center">
        {isDisabled ? null : (
          <ApplePayButton
            disabled={isPurchaseInProgress}
            onSubmit={handlePurchase}
          />
        )}
        <Touchable width="100%" onPress={onPressSupport}>
          <Container
            alignItems="center"
            paddingBottom={8}
            paddingTop={6}
            flexDirection="row"
            justifyContent="center"
          >
            <Text color="white" marginRight={1}>
              {strings.footer}
            </Text>
            <Icon name="info" size={15} />
          </Container>
        </Touchable>
      </Container>
    ),
    [isDisabled, isPurchaseInProgress, handlePurchase, onPressSupport]
  );

  return (
    <Sheet
      Footer={renderFooter}
      scrollEnabled
      isFullScreen
      cardBackgroundColor={colors.backgroundBlue}
    >
      <Container backgroundColor="backgroundBlue" paddingHorizontal={5}>
        <TopContent />
        <Subtitle text={strings.subtitle} />
        <FlatList
          data={inventoryData}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={keyExtractor}
        />
      </Container>
      {card ? (
        <Container marginBottom={16} padding={4}>
          <Subtitle text={strings.previewCard} />
          <Container paddingHorizontal={10}>
            <MediumPrepaidCard
              networkName={network}
              address={strings.customCardAddress}
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
    </Sheet>
  );
};

export default BuyPrepaidCard;

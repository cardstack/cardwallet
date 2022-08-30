import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';

import { Container, Icon, Sheet, Text, Touchable } from '@cardstack/components';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';
import { Routes } from '@cardstack/navigation';
import { colors } from '@cardstack/theme';
import { GetProductsQueryResult } from '@cardstack/types';

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
  background: '#0069F9',
  issuerName: 'Wyre',
  patternColor: 'black',
  patternUrl: null,
  textColor: 'white',
};

const BuyPrepaidCard = () => {
  const {
    onSelectCard,
    selectedCard,
    handlePurchase,
    isInventoryLoading,
    inventoryData,
    network,
    nativeCurrencyInfo,
    nativeBalance,
  } = useBuyPrepaidCard();

  const { navigate } = useNavigation();

  const renderItem = useCallback(
    ({ item }: { item: GetProductsQueryResult }) =>
      isInventoryLoading || !item.sku ? (
        <CardLoaderSkeleton />
      ) : (
        <CardContent
          onPress={() => onSelectCard(item)}
          isSelected={selectedCard?.sku === item.sku}
          amount={item?.sourceCurrencyPrice}
          quantity={item?.quantity}
        />
      ),
    [isInventoryLoading, onSelectCard, selectedCard]
  );

  const onPressSupport = useCallback(() => navigate(Routes.SUPPORT_AND_FEES), [
    navigate,
  ]);

  // necessary to avoid rendering issues with the skeleton
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderFooter = useMemo(
    () => (
      <Container paddingHorizontal={2} justifyContent="center">
        {!!selectedCard && <ApplePayButton onSubmit={handlePurchase} />}
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
    [selectedCard, handlePurchase, onPressSupport]
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
      {selectedCard ? (
        <Container marginBottom={16} padding={4}>
          <Subtitle text={strings.previewCard} />
          <Container paddingHorizontal={10}>
            <MediumPrepaidCard
              networkName={network}
              address={strings.customCardAddress}
              nativeCurrencyInfo={nativeCurrencyInfo}
              nativeBalance={nativeBalance}
              transferrable={selectedCard.transferrable}
              cardCustomization={DEFAULT_CARD_CONFIG}
            />
          </Container>
        </Container>
      ) : null}
    </Sheet>
  );
};

export default BuyPrepaidCard;

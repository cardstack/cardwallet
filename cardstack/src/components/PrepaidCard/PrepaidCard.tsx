import React, { useCallback, useState } from 'react';
import { Image } from 'react-native';

import logo from '../../assets/cardstackLogoTransparent.png';
import { PrepaidCardCustomization, PrepaidCardType } from '../../types';
import { CenteredContainer, ContainerProps } from '../Container';
import { Touchable } from '../Touchable';
import { CustomizableBackground } from './CustomizableBackground';
import Routes from '@rainbow-me/routes';
import { useNavigation } from '@rainbow-me/navigation';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from '@rainbow-me/hooks';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';
import { ColorTypes } from '@cardstack/theme';
import { Container, Icon, ScrollView, Text } from '@cardstack/components';

export interface PrepaidCardProps extends PrepaidCardType, ContainerProps {
  networkName: string;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  disabled?: boolean;
  cardCustomization?: PrepaidCardCustomization;
}

const SELECT_ICON_WIDTH = '13%';
const EDITING_COIN_ROW_WIDTH = '87%';

/**
 * A prepaid card component
 */
export const PrepaidCard = (props: PrepaidCardProps) => {
  const [isScrollable] = useState(false);
  const Wrapper = isScrollable ? ScrollView : Container;
  const { networkName, ...prepaidCard } = props;
  const { navigate } = useNavigation();

  const {
    editing,
    selected,
    pinned,
    hidden,
    select,
    deselect,
  } = usePinnedAndHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.PREPAID_CARDS;
  const isHidden = hidden.includes(prepaidCard.address);

  if (!isEditing && isHidden) {
    return null;
  }

  const isSelected = selected.includes(prepaidCard.address);
  const isPinned = pinned.includes(prepaidCard.address);
  const showIcon = isPinned || isHidden;
  const iconName = isHidden ? 'eye-off' : 'pin';
  const iconFamily = isHidden ? 'Feather' : 'MaterialCommunity';
  const editingIconName = isSelected ? 'check-circle' : 'circle';

  const onPress = () => {
    if (isEditing) {
      if (isSelected) {
        deselect(prepaidCard.address);
      } else {
        select(prepaidCard.address);
      }
    } else {
      navigate(Routes.PREPAID_CARD_MODAL, {
        prepaidCardProps: props,
      });
    }
  };

  return (
    <Wrapper width="100%" paddingHorizontal={4} marginBottom={4} {...props}>
      <Touchable
        width="100%"
        testID="prepaid-card"
        alignItems="center"
        paddingVertical={2}
        flexDirection="row"
        disabled={props.disabled}
        onPress={onPress}
      >
        {isEditing && (
          <Container
            testID={`coin-row-editing-icon-${editingIconName}`}
            width={SELECT_ICON_WIDTH}
          >
            <Icon
              name={editingIconName}
              iconSize="medium"
              iconFamily={iconFamily}
              color={isSelected ? 'teal' : null}
            />
          </Container>
        )}
        {isEditing && showIcon && (
          <Container
            height="100%"
            justifyContent="center"
            left="9%"
            position="absolute"
            width={50}
            zIndex={5}
            testID={`coin-row-icon-${iconName}`}
          >
            <CenteredContainer
              width={28}
              height={28}
              borderRadius={100}
              backgroundColor="black"
            >
              <Icon
                size={16}
                color="teal"
                name={iconName}
                iconFamily={iconFamily}
              />
            </CenteredContainer>
          </Container>
        )}
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          width={isEditing ? EDITING_COIN_ROW_WIDTH : '100%'}
        >
          <CustomizableBackground
            cardCustomization={prepaidCard.cardCustomization}
            isEditing={isEditing}
            address={prepaidCard.address}
          />
          <PrepaidCardInnerTop
            address={prepaidCard.address}
            cardCustomization={prepaidCard.cardCustomization}
            networkName={networkName}
          />
          <PrepaidCardInnerBottom {...props} />
        </Container>
        {isEditing && isHidden && (
          <Container
            backgroundColor="black"
            top={8}
            bottom={0}
            right={0}
            borderRadius={10}
            opacity={0.5}
            position="absolute"
            height="100%"
            width={EDITING_COIN_ROW_WIDTH}
            zIndex={1}
            testID="coin-row-hidden-overlay"
          />
        )}
      </Touchable>
    </Wrapper>
  );
};

export const PrepaidCardInnerTop = ({
  address,
  networkName,
  cardCustomization,
  smallCard = false,
}: {
  address: string;
  networkName: string;
  cardCustomization: PrepaidCardCustomization | undefined;
  smallCard?: boolean;
}) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    navigate(Routes.MODAL_SCREEN, {
      address,
      disableCopying: true,
      type: 'copy_address',
    });
  }, [address, navigate]);

  return (
    <Container width="100%" paddingHorizontal={6} paddingVertical={4}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          variant="overGradient"
          fontSize={smallCard ? 9 : 11}
          color={cardCustomization?.textColor as ColorTypes}
          style={{ textShadowColor: cardCustomization?.patternColor }}
          textShadowColor={cardCustomization?.patternColor as ColorTypes}
        >
          Issued by
        </Text>
        <Text
          variant="overGradient"
          fontSize={smallCard ? 8 : 11}
          weight="bold"
          letterSpacing={0.55}
          color={cardCustomization?.textColor as ColorTypes}
          style={{ textShadowColor: cardCustomization?.patternColor }}
          textShadowColor={cardCustomization?.patternColor as ColorTypes}
        >
          PREPAID CARD
        </Text>
      </Container>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Container maxWidth={smallCard ? 100 : 175}>
          <Text
            variant="overGradient"
            fontSize={smallCard ? 10 : 13}
            weight="extraBold"
            color={cardCustomization?.textColor as ColorTypes}
            textShadowColor={cardCustomization?.patternColor as ColorTypes}
            numberOfLines={1}
          >
            {cardCustomization?.issuerName || 'Unknown'}
          </Text>
        </Container>
        <Container flexDirection="column" paddingTop={3}>
          {smallCard ? (
            <Text
              variant="overGradient"
              fontFamily="RobotoMono-Regular"
              fontSize={smallCard ? 13 : 18}
              color={cardCustomization?.textColor as ColorTypes}
              textShadowColor={cardCustomization?.patternColor as ColorTypes}
            >
              {getAddressPreview(address)}
            </Text>
          ) : (
            <Touchable
              hitSlop={{
                top: 5,
                bottom: 5,
                left: 5,
                right: 5,
              }}
              onPress={onPress}
            >
              <Text
                variant="overGradient"
                fontFamily="RobotoMono-Regular"
                fontSize={smallCard ? 13 : 18}
                color={cardCustomization?.textColor as ColorTypes}
                textShadowColor={cardCustomization?.patternColor as ColorTypes}
              >
                {getAddressPreview(address)}
              </Text>
            </Touchable>
          )}
          <Text
            fontSize={smallCard ? 8 : 11}
            color={cardCustomization?.textColor as ColorTypes}
            textShadowColor={cardCustomization?.patternColor as ColorTypes}
            textAlign="right"
          >{`ON ${networkName.toUpperCase()}`}</Text>
        </Container>
      </Container>
    </Container>
  );
};

export const PrepaidCardInnerBottom = ({
  spendFaceValue,
  reloadable,
  nativeCurrency,
  currencyConversionRates,
  transferrable,
  smallCard = false,
}: PrepaidCardProps & { smallCard?: boolean }) => {
  const {
    tokenBalanceDisplay,
    nativeBalanceDisplay,
  } = convertSpendForBalanceDisplay(
    spendFaceValue.toString(),
    nativeCurrency,
    currencyConversionRates
  );

  const iconSize = smallCard
    ? { width: 28, height: 30, marginTop: 3 }
    : { width: 42, height: 46 };

  return (
    <Container
      paddingHorizontal={6}
      paddingVertical={4}
      paddingTop={smallCard ? 0 : 4}
    >
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container>
          <Text fontSize={smallCard ? 9 : 13} color="spendableBalance">
            Spendable Balance
          </Text>
          <Text fontSize={smallCard ? 29 : 40} fontWeight="700">
            {tokenBalanceDisplay}
          </Text>
        </Container>
        <Container {...iconSize}>
          <Image
            source={logo}
            style={{
              height: '100%',
              resizeMode: 'contain',
              width: '100%',
            }}
          />
        </Container>
      </Container>
      <Container
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="space-between"
        marginTop={2}
      >
        <Text fontWeight="700">{nativeBalanceDisplay}</Text>
        <Container alignItems="flex-end">
          <Text variant={smallCard ? 'xsGrey' : 'smallGrey'}>
            {reloadable ? 'RELOADABLE' : 'NON-RELOADABLE'}
          </Text>
          <Text variant={smallCard ? 'xsGrey' : 'smallGrey'}>
            {transferrable ? 'TRANSFERRABLE' : 'NON-TRANSFERRABLE'}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

import React, { useCallback, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import logo from '../../assets/cardstackLogoTransparent.png';
import { PrepaidCardCustomization, PrepaidCardType } from '../../types';
import { CenteredContainer, ContainerProps } from '../Container';
import { Touchable } from '../Touchable';
import { CustomizableBackground } from './CustomizableBackground';
import {
  Container,
  Icon,
  ScrollView,
  Text,
  TextProps,
} from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

const styles = StyleSheet.create({
  TextOverGrad: {
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 0,
  },
});

const TextOverGrad = (props: TextProps & { shadowColor?: string }) => (
  <Text
    {...props}
    style={[
      styles.TextOverGrad,
      props.shadowColor ? { textShadowColor: props.shadowColor } : null,
      props.style,
    ]}
  >
    {props.children}
  </Text>
);

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
          borderColor="buttonPrimaryBorder"
          width={isEditing ? EDITING_COIN_ROW_WIDTH : '100%'}
        >
          <CustomizableBackground
            cardCustomization={prepaidCard.cardCustomization}
            isEditing={isEditing}
            address={prepaidCard.address}
          />
          <Top {...prepaidCard} networkName={networkName} />
          <Bottom {...props} />
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

const Top = ({ address, networkName, cardCustomization }: PrepaidCardProps) => {
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
        <TextOverGrad
          size="xxs"
          color={cardCustomization?.textColor as ColorTypes}
          shadowColor={cardCustomization?.patternColor}
        >
          Issued by
        </TextOverGrad>
        <TextOverGrad
          fontSize={11}
          weight="bold"
          letterSpacing={0.55}
          color={cardCustomization?.textColor as ColorTypes}
          shadowColor={cardCustomization?.patternColor}
        >
          PREPAID CARD
        </TextOverGrad>
      </Container>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Container maxWidth={175}>
          <TextOverGrad
            size="xs"
            weight="extraBold"
            color={cardCustomization?.textColor as ColorTypes}
            shadowColor={cardCustomization?.patternColor}
            numberOfLines={1}
          >
            {cardCustomization?.issuerName || 'Unknown'}
          </TextOverGrad>
        </Container>
        <Container flexDirection="column" paddingTop={3}>
          <Touchable
            hitSlop={{
              top: 5,
              bottom: 5,
              left: 5,
              right: 5,
            }}
            onPress={onPress}
          >
            <TextOverGrad
              variant="shadowRoboto"
              color={cardCustomization?.textColor as ColorTypes}
              shadowColor={cardCustomization?.patternColor}
            >
              {getAddressPreview(address)}
            </TextOverGrad>
          </Touchable>
          <TextOverGrad
            fontSize={11}
            color={cardCustomization?.textColor as ColorTypes}
            shadowColor={cardCustomization?.patternColor}
            textAlign="right"
          >{`ON ${networkName.toUpperCase()}`}</TextOverGrad>
        </Container>
      </Container>
    </Container>
  );
};

const Bottom = ({
  spendFaceValue,
  reloadable,
  nativeCurrency,
  currencyConversionRates,
  transferrable,
}: PrepaidCardProps) => {
  const {
    tokenBalanceDisplay,
    nativeBalanceDisplay,
  } = convertSpendForBalanceDisplay(
    spendFaceValue.toString(),
    nativeCurrency,
    currencyConversionRates
  );

  return (
    <Container paddingHorizontal={6} paddingVertical={4}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container>
          <Text fontSize={13} color="spendableBalance">
            Spendable Balance
          </Text>
          <Text fontSize={40} fontWeight="700">
            {tokenBalanceDisplay}
          </Text>
        </Container>
        <Container height={46} width={42}>
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
          <Text variant="smallGrey">
            {reloadable ? 'RELOADABLE' : 'NON-RELOADABLE'}
          </Text>
          <Text variant="smallGrey">
            {transferrable ? 'TRANSFERRABLE' : 'NON-TRANSFERRABLE'}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

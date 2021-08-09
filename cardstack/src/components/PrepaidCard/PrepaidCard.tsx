import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet } from 'react-native';
import SVG, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  SvgXml,
} from 'react-native-svg';
import logo from '../../assets/cardstackLogoTransparent.png';
import { PrepaidCardType, PrepaidCardCustomization } from '../../types';
import { CenteredContainer, ContainerProps } from '../Container';
import { Touchable } from '../Touchable';
import { ColorTypes } from '@cardstack/theme';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
  useDimensions,
} from '@rainbow-me/hooks';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
  parseLinearGradient,
} from '@cardstack/utils';
import {
  Container,
  Icon,
  ScrollView,
  Text,
  TextProps,
} from '@cardstack/components';
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

interface CardGradientProps {
  cardCustomization?: PrepaidCardCustomization;
  isEditing?: boolean;
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

const CustomizableBackground = ({
  cardCustomization,
  isEditing,
}: CardGradientProps) => {
  const { width } = useDimensions();

  const patternUrl = cardCustomization?.patternUrl
    ? cardCustomization.patternUrl.startsWith('http')
      ? cardCustomization.patternUrl
      : `https://app.cardstack.com${cardCustomization.patternUrl}`
    : null;

  const { hasGradient, angle, stop1, stop2 } = parseLinearGradient(
    cardCustomization
  );

  return (
    <SVG
      width="100%"
      height={110}
      style={{ position: 'absolute' }}
      key={`header_background_${isEditing}`}
    >
      {hasGradient && (
        <Defs>
          <LinearGradient
            id="grad"
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            gradientTransform={`rotate(${angle}, ${width / 2}, 55)`}
          >
            <Stop {...stop1} />
            <Stop {...stop2} />
          </LinearGradient>
        </Defs>
      )}
      <Rect
        id="Gradient"
        width="100%"
        height="110"
        fill={hasGradient ? 'url(#grad)' : cardCustomization?.background}
      />
      {patternUrl && (
        <PatternUri
          uri={patternUrl}
          patternColor={cardCustomization?.patternColor}
        />
      )}
      <G transform="translate(0 71)">
        <Path
          d="M 0 164.992 v -0.127 H 0 V 0 H 139.563 s 13.162 0.132 24.094 12.362 s 15.768 15.605 15.768 15.605 s 7.3 8.09 22.43 8.452 H 411 l -0.064 128.572 Z"
          fill="#fff"
        />
      </G>
    </SVG>
  );
};

const PatternUri = ({
  uri,
  patternColor,
}: {
  uri: string;
  patternColor?: string;
}) => {
  const { width: screenWidth } = useDimensions();

  const [patternObj, setPattern] = useState<{
    pattern: string;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!uri || !screenWidth) return;

    async function getPattern() {
      try {
        const response = await (
          await fetch(
            uri.startsWith('http') ? uri : `https://app.cardstack.com${uri}`
          )
        ).text();

        const viewBox = response
          ? (/viewBox="([^"]+)"/.exec(response) || '')[1].trim().split(' ')
          : [];

        // mapping svg pattern width
        const width =
          screenWidth > Number(viewBox[2])
            ? screenWidth
            : Number(viewBox[2]) || screenWidth;

        // mapping svg pattern height filling width but keeping ratio
        const height =
          screenWidth > Number(viewBox[2])
            ? (screenWidth / Number(viewBox[2])) * Number(viewBox[3])
            : Number(viewBox[3]) || 110;

        setPattern({
          pattern: response,
          width,
          height,
        });
      } catch {
        return;
      }
    }

    getPattern();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return patternObj && patternObj.pattern ? (
    <SvgXml
      xml={patternObj.pattern}
      fill={patternColor}
      x="0"
      y="0"
      width={patternObj.width}
      height={patternObj.height}
    />
  ) : null;
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

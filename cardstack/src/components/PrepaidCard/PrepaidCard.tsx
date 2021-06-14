import React, { useState } from 'react';
import { Image } from 'react-native';
import SVG, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import logo from '../../assets/cardstackLogoTransparent.png';
import { PrepaidCardType } from '../../types';
import { CenteredContainer } from '../Container';
import {
  PinnedHiddenSectionOption,
  useAccountSettings,
  usePinnedAndHiddenItemOptions,
} from '@rainbow-me/hooks';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';
import {
  Container,
  Icon,
  ScrollView,
  Text,
  Touchable,
} from '@cardstack/components';

interface PrepaidCardProps extends PrepaidCardType {
  networkName: string;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
}

const SELECT_ICON_WIDTH = '13%';
const EDITING_COIN_ROW_WIDTH = '87%';

/**
 * A prepaid card component
 */
export const PrepaidCard = (props: PrepaidCardProps) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const Wrapper = isScrollable ? ScrollView : Container;
  const { networkName, ...prepaidCard } = props;

  const [address] = useState(getAddressPreview(prepaidCard.address));

  const {
    editing,
    selected,
    pinned,
    hidden,
    select,
    deselect,
  } = usePinnedAndHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.PREPAID_CARDS;
  const isSelected = selected.includes(prepaidCard.address);
  const isPinned = pinned.includes(prepaidCard.address);
  const isHidden = hidden.includes(prepaidCard.address);

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
      setIsScrollable(!isScrollable);
    }
  };

  return (
    <Wrapper width="100%" paddingHorizontal={4} marginBottom={4}>
      <Touchable
        onPress={onPress}
        width="100%"
        testID="prepaid-card"
        alignItems="center"
        paddingVertical={2}
        flexDirection="row"
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
          <GradientBackground />
          {/* hard code issuer for now */}
          <Top
            {...prepaidCard}
            issuer="Cardstack"
            networkName={networkName}
            address={address}
          />
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

const GradientBackground = () => (
  <SVG width="100%" height={110} style={{ position: 'absolute' }}>
    <Defs>
      <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#00ebe5" stopOpacity="1" />
        <Stop offset="1" stopColor="#c3fc33" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Rect id="Gradient" width="100%" height="110" fill="url(#grad)" />
    <G
      id="Bottom_platter"
      data-name="Bottom platter"
      transform="translate(0 71)"
    >
      <Path
        id="Union_18"
        data-name="Union 18"
        d="M 0 164.992 v -0.127 H 0 V 0 H 139.563 s 13.162 0.132 24.094 12.362 s 15.768 15.605 15.768 15.605 s 7.3 8.09 22.43 8.452 H 411 l -0.064 128.572 Z"
        fill="#fff"
      />
    </G>
  </SVG>
);

const Top = ({ issuer, address, networkName }: PrepaidCardProps) => {
  return (
    <Container width="100%" paddingHorizontal={6} paddingVertical={4}>
      <Container width="100%">
        <Text size="xxs">Issued by</Text>
      </Container>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text size="xs" weight="extraBold">
          {issuer}
        </Text>
        <Container flexDirection="row">
          <Text variant="shadowRoboto">{getAddressPreview(address)}</Text>
        </Container>
      </Container>
      <Container width="100%" alignItems="flex-end">
        <Text fontSize={11}>{`ON ${networkName.toUpperCase()}`}</Text>
      </Container>
    </Container>
  );
};

const Bottom = ({
  spendFaceValue,
  reloadable,
  issuer,
  nativeCurrency,
  currencyConversionRates,
}: PrepaidCardProps) => {
  const { accountAddress } = useAccountSettings();
  const transferrable = accountAddress === issuer;

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
          <Text fontSize={13}>Spendable Balance</Text>
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

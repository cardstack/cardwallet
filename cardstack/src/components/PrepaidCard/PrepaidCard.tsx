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
import { ExpandedCard, ExpandedCardProps } from './ExpandedCard';
import { Container, ScrollView, Text, Touchable } from '@cardstack/components';

export const PREPAID_CARD_HEIGHT = 250;

interface PrepaidCardProps extends ExpandedCardProps {
  address: string;
  tokens: {
    native: {
      balance: {
        display: string;
      };
    };
  }[];
  spendFaceValue: string;
}

/**
 * A prepaid card component
 */
export const PrepaidCard = (props: PrepaidCardProps) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const { address, tokens, spendFaceValue } = props;
  const usdBalance = tokens[0].native.balance.display;
  const Wrapper = isScrollable ? ScrollView : Container;

  return (
    <Wrapper width="100%" paddingHorizontal={4}>
      <Touchable
        onPress={() => setIsScrollable(!isScrollable)}
        width="100%"
        testID="prepaid-card"
      >
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <GradientBackground />
          {/* need to figure out what to use for issuer */}
          <Top issuer="Cardstack" address={address} />
          <Bottom cpxdBalance={spendFaceValue} usdBalance={usdBalance} />
        </Container>
      </Touchable>
      {isScrollable && <ExpandedCard recentActivity={props.recentActivity} />}
    </Wrapper>
  );
};

const GradientBackground = () => (
  <SVG
    width="100%"
    height={110}
    viewBox="0 0 400 100"
    style={{ position: 'absolute', top: -12 }}
  >
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
        d="M0,164.992v-.127H0V0H139.563s13.162.132,24.094,12.362,15.768,15.605,15.768,15.605,7.3,8.09,22.43,8.452H335l-.064,128.572Z"
        fill="#fff"
      />
    </G>
  </SVG>
);

const Top = ({ issuer, address }: { issuer: string; address: string }) => (
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
        <Text variant="shadowRoboto">{address.slice(0, 6)}</Text>
        <Text variant="shadowRoboto" letterSpacing={1.35}>
          ...
        </Text>
        <Text variant="shadowRoboto">{address.slice(-4)}</Text>
      </Container>
    </Container>
    <Container width="100%" alignItems="flex-end">
      <Text fontSize={11}>on xDai chain</Text>
    </Container>
  </Container>
);

const Bottom = ({
  cpxdBalance,
  usdBalance,
}: {
  cpxdBalance: string;
  usdBalance: string;
}) => {
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
            {`§${cpxdBalance}`}
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
        <Text fontWeight="700">{usdBalance}</Text>
        <Container alignItems="flex-end">
          <Text variant="smallGrey">RELOADABLE</Text>
          <Text variant="smallGrey">NON-TRANSFRERRABLE</Text>
        </Container>
      </Container>
    </Container>
  );
};

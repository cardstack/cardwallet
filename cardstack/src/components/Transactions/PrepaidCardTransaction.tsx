import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';
import { Linking } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Icon, IconName } from '../Icon';
import {
  Container,
  HorizontalDivider,
  NetworkBadge,
  Text,
  Touchable,
} from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

export const PrepaidCardTransaction = (
  props: TopProps &
    BottomProps & { Footer?: JSX.Element; transactionHash: string }
) => {
  const { Footer } = props;
  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);

  const onPressTransaction = () => {
    showActionSheetWithOptions(
      {
        options: ['View on Blockscout', 'Cancel'],
        cancelButtonIndex: 1,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          Linking.openURL(`${blockExplorer}/tx/${props.transactionHash}`);
        }
      }
    );
  };

  return (
    <Container width="100%" paddingHorizontal={4} marginVertical={2}>
      <Touchable width="100%" onPress={onPressTransaction}>
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <Top {...props} />
          <Container paddingHorizontal={5} paddingTop={4}>
            <Bottom {...props} />
          </Container>
          {Footer && (
            <>
              <HorizontalDivider />
              {Footer}
            </>
          )}
        </Container>
      </Touchable>
    </Container>
  );
};

interface TopProps {
  address: string;
}

const Top = (props: TopProps) => (
  <Container
    height={40}
    flexDirection="row"
    paddingHorizontal={5}
    justifyContent="space-between"
    width="100%"
    alignItems="center"
  >
    <SVG />
    <Container flexDirection="row" alignItems="center">
      <NetworkBadge marginRight={2} />
      <Text variant="shadowRoboto" size="xs">
        {getAddressPreview(props.address)}
      </Text>
    </Container>
    <Text weight="extraBold" size="small">
      PREPAID CARD
    </Text>
  </Container>
);

interface BottomProps {
  iconName: IconName;
  status: string;
  operator: string;
  topText?: string;
  primaryText: string;
  subText?: string;
}

const Bottom = (props: BottomProps) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
      >
        <Container flexDirection="row" alignItems="center">
          <Icon name="spend" />
          <Container marginLeft={4} flexDirection="row">
            <Icon name={props.iconName} size={16} color="blueText" />
            <Text variant="subText" weight="bold" marginLeft={1}>
              {props.status}
            </Text>
          </Container>
        </Container>
        <Container flexDirection="column" marginLeft={3} alignItems="flex-end">
          {props.topText && <Text size="small">{props.topText}</Text>}
          <Text weight="extraBold">{`${props.operator} ${props.primaryText}`}</Text>
          {props.subText && <Text variant="subText">{props.subText}</Text>}
        </Container>
      </Container>
    </Container>
  );
};

const SVG = () => {
  return (
    <Svg height="40" width="115%" style={{ position: 'absolute' }}>
      <Defs>
        <LinearGradient
          id="grad"
          x1={0.168}
          x2={1.072}
          y2={1.05}
          gradientUnits="objectBoundingBox"
        >
          <Stop offset={0} stopColor="#00ebe5" />
          <Stop offset={1} stopColor="#c3fc33" />
        </LinearGradient>
      </Defs>
      <Rect id="Gradient" width="115%" height="40" fill="url(#grad)" />
    </Svg>
  );
};

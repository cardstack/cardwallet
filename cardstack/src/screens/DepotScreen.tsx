import React from 'react';
import { Linking, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { BackButton } from '../../../src/components/header';
import isNativeStackAvailable from '../../../src/helpers/isNativeStackAvailable';
import {
  CenteredContainer,
  Container,
  Icon,
  Text,
  Touchable,
} from '@cardstack/components';
import { DepotType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import { showActionSheetWithOptions } from '@rainbow-me/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

interface RouteType {
  params: { depot: DepotType };
  key: string;
  name: string;
}

export default function DepotScreen() {
  const { goBack } = useNavigation();
  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);

  const {
    params: { depot },
  } = useRoute<RouteType>();

  const { address } = depot;

  const onPressInformation = () => {
    showActionSheetWithOptions(
      {
        options: ['View on Blockscout', 'Cancel'],
        cancelButtonIndex: 1,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          Linking.openURL(`${blockExplorer}/address/${address}`);
        }
      }
    );
  };

  return (
    <Container backgroundColor="blue" top={0} width="100%">
      <StatusBar barStyle="light-content" />
      <Container height="100%" justifyContent="flex-end" paddingBottom={4}>
        <Container paddingTop={14} paddingBottom={4} backgroundColor="black">
          <Container paddingTop={isNativeStackAvailable ? 4 : 1}>
            <CenteredContainer flexDirection="row">
              <Container left={0} position="absolute">
                {/* @ts-ignore */}
                <BackButton
                  color="white"
                  direction="left"
                  onPress={goBack}
                  testID="goToBalancesFromScanner"
                />
              </Container>
              <Container alignItems="center">
                <Text color="white" weight="bold">
                  Depot
                </Text>
                <Touchable onPress={onPressInformation}>
                  <Container flexDirection="row" alignItems="center">
                    <Text
                      fontFamily="RobotoMono-Regular"
                      color="white"
                      size="xs"
                      marginRight={2}
                    >
                      {getAddressPreview(address)}
                    </Text>
                    <Icon name="info" size={15} />
                  </Container>
                </Touchable>
              </Container>
              <Container right={20} position="absolute">
                <Touchable onPress={onPressInformation}>
                  <Icon name="more-horizontal" color="white" />
                </Touchable>
              </Container>
            </CenteredContainer>
          </Container>
        </Container>

        <CenteredContainer flex={1} width="100%">
          <Text>Depot stuffs</Text>
        </CenteredContainer>
      </Container>
    </Container>
  );
}

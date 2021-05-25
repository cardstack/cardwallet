import React from 'react';
import { StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BackButton } from '../../../src/components/header';
import isNativeStackAvailable from '../../../src/helpers/isNativeStackAvailable';
import { CenteredContainer, Container, Text } from '@cardstack/components';
import { DepotType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';

interface RouteType {
  params: { depot: DepotType };
  key: string;
  name: string;
}

export default function DepotScreen() {
  const { goBack } = useNavigation();

  const {
    params: { depot },
  } = useRoute<RouteType>();

  const { address } = depot;

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
                <Text fontFamily="RobotoMono-Regular" color="white" size="xs">
                  {getAddressPreview(address)}
                </Text>
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

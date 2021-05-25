import React from 'react';
import { StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../../../src/components/header';
import { SheetHandle, SheetTitle } from '../../../src/components/sheet';
import isNativeStackAvailable from '../../../src/helpers/isNativeStackAvailable';
import { deviceUtils } from '../../../src/utils';
import { useNavigation } from '@rainbow-me/navigation';
import { CenteredContainer, Container, Text } from '@cardstack/components';

const deviceHeight = deviceUtils.dimensions.height;
const statusBarHeight = getStatusBarHeight(true);

const sheetHeight =
  deviceHeight -
  statusBarHeight -
  (isNativeStackAvailable ? (deviceHeight >= 812 ? 10 : 20) : 0);

export default function DepotSheet() {
  const { goBack } = useNavigation();

  return (
    <SafeAreaView>
      <Container
        backgroundColor="white"
        borderTopLeftRadius={isNativeStackAvailable ? 0 : 16}
        borderTopRightRadius={isNativeStackAvailable ? 0 : 16}
        height={isNativeStackAvailable ? deviceHeight : sheetHeight}
        top={isNativeStackAvailable ? 0 : statusBarHeight}
        width="100%"
      >
        <StatusBar barStyle="light-content" />
        <Container
          height={isNativeStackAvailable ? sheetHeight : '100%'}
          justifyContent="flex-end"
          paddingBottom={4}
        >
          <Container paddingVertical={2}>
            {/* <Container alignSelf="center">
              <SheetHandle />
            </Container> */}
            <Container paddingTop={isNativeStackAvailable ? 4 : 1}>
              <CenteredContainer flexDirection="row">
                <Container left={0} position="absolute">
                  {/* @ts-ignore */}
                  <BackButton
                    color="blue"
                    direction="left"
                    onPress={() => goBack()}
                    testID="goToBalancesFromScanner"
                  />
                </Container>
                <SheetTitle>Add Funds</SheetTitle>
              </CenteredContainer>
            </Container>
          </Container>

          <CenteredContainer flex={1} width="100%">
            <Text>Foo</Text>
          </CenteredContainer>
        </Container>
      </Container>
    </SafeAreaView>
  );
}

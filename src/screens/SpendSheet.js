import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import styled from 'styled-components';

import { Column } from '../components/layout';

import { Text } from '@cardstack/components';

import { Device } from '@cardstack/utils';
import { borders } from '@rainbow-me/styles';
import { deviceUtils } from '@rainbow-me/utils';

const sheetHeight =
  deviceUtils.dimensions.height - (Device.isAndroid ? 30 : 10);
const statusBarHeight = getStatusBarHeight(true);

const Container = styled.View`
  background-color: ${({ theme: { colors } }) => colors.transparent};
  flex: 1;
  padding-top: ${statusBarHeight};
  width: 100%;
`;

const SheetContainer = styled(Column).attrs({
  align: 'center',
  flex: 1,
})`
  ${borders.buildRadius('top', 16)};
  background-color: ${({ theme: { colors } }) => colors.white};
  height: ${Device.isAndroid ? sheetHeight : '100%'};
  width: 100%;
`;

export default function SpendSheet() {
  const { params } = useRoute();
  return (
    <Container>
      {ios && <StatusBar barStyle="light-content" />}
      <SheetContainer>
        <Text>{params.merchant}</Text>
        <Text>{params.spend}</Text>
        <Text>{params.timestamp}</Text>
      </SheetContainer>
    </Container>
  );
}

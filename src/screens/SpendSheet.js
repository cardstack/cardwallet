import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import styled from 'styled-components';

import { Column } from '../components/layout';

import isNativeStackAvailable from '../helpers/isNativeStackAvailable';

import { Text } from '@cardstack/components';

import { borders } from '@rainbow-me/styles';
import { deviceUtils } from '@rainbow-me/utils';

const sheetHeight = deviceUtils.dimensions.height - (android ? 30 : 10);
const statusBarHeight = getStatusBarHeight(true);

const Container = styled.View`
  background-color: ${({ theme: { colors } }) => colors.transparent};
  flex: 1;
  padding-top: ${isNativeStackAvailable ? 0 : statusBarHeight};
  width: 100%;
`;

const SheetContainer = styled(Column).attrs({
  align: 'center',
  flex: 1,
})`
  ${borders.buildRadius('top', isNativeStackAvailable ? 0 : 16)};
  background-color: ${({ theme: { colors } }) => colors.white};
  height: ${isNativeStackAvailable || android ? sheetHeight : '100%'};
  width: 100%;
`;

export default function SpendSheet() {
  const { params } = useRoute();
  console.log('--------------------', { params });
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

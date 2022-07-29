import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { Container, Image, Text } from '@cardstack/components';
import { appName } from '@cardstack/constants';
import { Device } from '@cardstack/utils';

import { shadow } from '@rainbow-me/styles';

import CardWalletLogo from '../../../assets/cardstackLogo.png';

const styles: StyleProp<ViewStyle> = Device.isIOS
  ? shadow.buildAsObject(0, -1, 2, 'rgba(0, 0, 0, 0.25)', 1)
  : {
      borderTopWidth: 0.5,
      borderTopColor: 'rgba(0, 0, 0, 0.25)',
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      elevation: 3,
    };

export const PaymentRequestFooter = () => (
  <Container
    alignSelf="flex-end"
    backgroundColor="white"
    paddingBottom={5}
    paddingTop={3}
    style={styles}
    width="100%"
  >
    <Container alignItems="center" justifyContent="center">
      <Image height={30} source={CardWalletLogo} width={30} />
      <Text marginTop={1} size="xs" textAlign="center">
        Recipient must have the{'\n'}
        <Text weight="bold" size="xs">
          {appName} mobile app
        </Text>{' '}
        installed.
      </Text>
    </Container>
  </Container>
);

import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import styled from 'styled-components';
import { Column } from '../layout';
import { Text } from '../text';
import WalletConnectExplainerItem from './WalletConnectExplainerItem';
import CardStackToCardPay from '@rainbow-me/assets/cardStackToCardPay.png';
import IconQRScan from '@rainbow-me/assets/icon_QR_Scan.png';
import { ImgixImage } from '@rainbow-me/images';

const CardStackToCardPayImg = styled(ImgixImage).attrs({
  source: CardStackToCardPay,
})`
  width: 100;
  height: 31;
  margin-bottom: 12;
`;

const IconQRScanImg = styled(ImgixImage).attrs({
  source: IconQRScan,
})`
  width: 30;
  height: 30;
  margin-bottom: 12;
`;

const CustomText = props => {
  const { colors } = useTheme();

  return (
    <Text
      align="center"
      color={colors.blueText}
      fontFamily="OpenSans-Regular"
      size={14}
      weight={props.bold ? 'semibold' : 'light'}
      {...props}
    >
      {props.children}
    </Text>
  );
};

export default function WalletConnectExplainer() {
  const openWalletConnectWebsite = useCallback(() => {
    Linking.openURL('https://walletconnect.org/');
  }, []);

  return (
    <Column>
      <WalletConnectExplainerItem
        renderContent={() => (
          <CustomText style={{ marginTop: 5 }}>
            <CustomText>Visit </CustomText>
            <CustomText bold onPress={openWalletConnectWebsite}>
              app.cardstack.com
            </CustomText>
            <CustomText>
              {' '}
              to connect your wallet to use the full Card Pay functions
            </CustomText>
          </CustomText>
        )}
        renderImage={() => <CardStackToCardPayImg />}
        title="Connect to Card Pay"
      />
      <WalletConnectExplainerItem
        renderContent={() => (
          <CustomText style={{ marginTop: 5 }}>
            to initiate mobile payment directly
          </CustomText>
        )}
        renderImage={() => <IconQRScanImg />}
        title="Scan Merchant QR code"
      />
    </Column>
  );
}

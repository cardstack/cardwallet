import React from 'react';
import QRCodeBase, { QRCodeProps } from 'react-native-qrcode-svg';
import CardstackLogo from '../../assets/cardstackLogo.png';

export const QRCode = ({
  ecl = 'M',
  logo = CardstackLogo,
  logoMargin = 10,
  logoBackgroundColor = 'white',
  size = 150,
  logoSize = 40,
  value = 'QR Code',
  ...props
}: QRCodeProps) => {
  return (
    <QRCodeBase
      {...{
        logo,
        logoSize,
        logoBackgroundColor,
        ecl,
        logoMargin,
        size,
        value,
        ...props,
      }}
    />
  );
};

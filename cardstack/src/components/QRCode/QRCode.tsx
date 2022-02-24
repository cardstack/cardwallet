import React, { memo } from 'react';
import SVGQRCode, { QRCodeProps } from 'react-native-qrcode-svg';

export const QRCode = memo(
  ({
    size = 300,
    logoSize = 34,
    logoBackgroundColor = 'white',
    ...rest
  }: QRCodeProps) => (
    <SVGQRCode
      size={size}
      logoSize={logoSize}
      logoBackgroundColor={logoBackgroundColor}
      {...rest}
    />
  )
);

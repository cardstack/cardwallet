import React from 'react';
import { Image } from 'react-native';
import { QRCode as EasyQRCode, Canvas } from 'easyqrcode-react-native';
import CardstackLogo from '../../assets/cardstackColorLogo.png';
import { CenteredContainer } from '@cardstack/components';

const Default_QRCode_Options = {
  dotScale: 0.8,
  dotScaleA: 0.8,
  dotScaleAO: 0.8,
  dotScaleAI: 0.8,
};

interface QRCodeProps {
  size?: number; // Size of canvas (default 300)
  data: string; // The data to be encoded in the QR code
  logo?: any; // image to be rendered in the center of the QR code
  logoWidth?: number;
  logoHeight?: number;
  logoBackgroundTransparent?: boolean;
  logoBackgroundColor?: string;
}

export const QRCode = ({
  size = 300,
  data,
  logo = CardstackLogo,
  logoWidth = 40,
  logoHeight = 40,
  logoBackgroundTransparent = false,
  logoBackgroundColor = '#fff',
}: QRCodeProps) => {
  const generateQRCode = (canvas: any) => {
    if (data && canvas !== null) {
      // QRCode options
      const options = {
        ...Default_QRCode_Options,
        text: data,
        width: size,
        height: size,
        logo: Image.resolveAssetSource(logo).uri,
        logoWidth,
        logoHeight,
        logoBackgroundTransparent,
        logoBackgroundColor,
      };

      // Create QRCode Object
      // eslint-disable-next-line no-new
      new EasyQRCode(canvas, options);
    }
  };

  return (
    <CenteredContainer>
      <Canvas ref={generateQRCode} />
    </CenteredContainer>
  );
};

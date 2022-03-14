import React, { memo } from 'react';
import CardstackLogo from '../../assets/cardstackColorLogo.png';
import { CenteredContainer } from '../Container';
import { useDimensions } from '@rainbow-me/hooks';
import { QRCode } from '@cardstack/components';
import {
  crosshair,
  CROSSHAIR_SIZE,
} from '@cardstack/screens/QRScannerScreen/pages/QRCodeScanner/components';

const PADDING = 85;

type QRCodeParam = {
  value: string;
};

export const StyledQRCode = memo(({ value }: QRCodeParam) => {
  const { width } = useDimensions();
  const QRCodeSize = Math.round(width - PADDING * 2);
  const LogoSize = Math.round(QRCodeSize * 0.15);

  return (
    <CenteredContainer
      backgroundColor="white"
      borderRadius={crosshair.radius}
      borderWidth={1}
      borderColor="borderGray"
      width={CROSSHAIR_SIZE}
      height={CROSSHAIR_SIZE}
    >
      <QRCode
        size={QRCodeSize}
        value={value}
        logo={CardstackLogo}
        logoSize={LogoSize}
        logoBorderRadius={LogoSize / 3}
      />
    </CenteredContainer>
  );
});

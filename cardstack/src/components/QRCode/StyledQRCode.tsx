import React, { memo } from 'react';
import { Pressable } from 'react-native';

import { QRCode } from '@cardstack/components';
import {
  crosshair,
  CROSSHAIR_SIZE,
} from '@cardstack/screens/QRScannerScreen/pages/QRCodeScanner/components';

import { useDimensions } from '@rainbow-me/hooks';

import CardstackLogo from '../../assets/cardstackColorLogo.png';
import { CenteredContainer } from '../Container';

const PADDING = 85;

type QRCodeParam = {
  value: string;
  addLogo?: boolean;
  onLongPress?: () => void;
};

export const StyledQRCode = memo(
  ({ onLongPress, value, addLogo = true }: QRCodeParam) => {
    const { width } = useDimensions();
    const QRCodeSize = Math.round(width - PADDING * 2);
    const LogoSize = Math.round(QRCodeSize * 0.15);

    return (
      <CenteredContainer
        backgroundColor="grayCardBackground"
        borderRadius={crosshair.radius}
        borderWidth={1}
        borderColor="borderGray"
        width={CROSSHAIR_SIZE}
        height={CROSSHAIR_SIZE}
      >
        <Pressable onLongPress={onLongPress}>
          <QRCode
            size={QRCodeSize}
            value={value}
            logo={addLogo ? CardstackLogo : undefined}
            logoSize={LogoSize}
            logoBorderRadius={LogoSize / 3}
          />
        </Pressable>
      </CenteredContainer>
    );
  }
);

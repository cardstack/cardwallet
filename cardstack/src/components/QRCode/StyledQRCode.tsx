import React, { memo } from 'react';
import CardstackLogo from '../../assets/cardstackColorLogo.png';
import { useDimensions } from '@rainbow-me/hooks';
import { Container, QRCode } from '@cardstack/components';

const PADDING = 80;

type QRCodeParam = {
  value: string;
};

export const StyledQRCode = memo(({ value }: QRCodeParam) => {
  const { width } = useDimensions();
  const QRCodeSize = Math.round(width - PADDING * 2);
  const LogoSize = Math.round(QRCodeSize * 0.15);

  return (
    <Container alignItems="center" flex={1} paddingTop={8}>
      <Container
        backgroundColor="white"
        alignItems="center"
        justifyContent="center"
        borderRadius={40}
        borderWidth={1}
        borderColor="borderGray"
        width={QRCodeSize + 50}
        height={QRCodeSize + 50}
      >
        <QRCode
          size={QRCodeSize}
          value={value}
          logo={CardstackLogo}
          logoSize={LogoSize}
        />
      </Container>
    </Container>
  );
});

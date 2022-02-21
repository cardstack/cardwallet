import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDimensions } from '@rainbow-me/hooks';
import { Container, QRCode } from '@cardstack/components';
import { colors } from '@cardstack/theme';

const PADDING = 80;

type QRCodeParam = {
  value: string;
};

export const StyledQRCode = ({ value }: QRCodeParam) => {
  const { width } = useDimensions();
  const QRCodeSize = Math.round(width - PADDING * 2);

  const [isFocus, setFocus] = useState(false);
  const [isQRCodeRendering, setQRCodeState] = useState(true);
  const onQRCodeRendered = useCallback(() => setQRCodeState(false), []);
  useFocusEffect(
    useCallback(() => {
      setFocus(true);

      return () => setFocus(false);
    }, [])
  );

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
        {isFocus && (
          <QRCode
            size={QRCodeSize}
            data={value}
            onRenderingEnd={onQRCodeRendered}
          />
        )}
        {isQRCodeRendering && (
          <Container position="absolute">
            <ActivityIndicator size="large" color={colors.blueText} />
          </Container>
        )}
      </Container>
    </Container>
  );
};

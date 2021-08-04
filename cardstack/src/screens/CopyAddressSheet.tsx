import React, { useState } from 'react';
import { useRoute } from '@react-navigation/core';
import {
  ToastPositionContainer,
  CopyToast,
} from '../../../src/components/toasts';
import {
  Container,
  Text,
  SheetHandle,
  NetworkBadge,
  Button,
} from '@cardstack/components';
import { useClipboard } from '@rainbow-me/hooks';
import { abbreviations } from '@rainbow-me/utils';

const CopyAddressSheet = () => {
  const {
    params: { address, disableCopying },
  } = useRoute() as { params: { address: string; disableCopying?: boolean } };

  const { setClipboard } = useClipboard();
  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);

  const handleCopiedText = () => {
    setClipboard(address);
    setCopiedText(abbreviations.formatAddressForDisplay(address));
    setCopyCount(count => count + 1);
  };

  return (
    <Container height="100%" justifyContent="center">
      <Container
        alignItems="center"
        width="100%"
        padding={2}
        backgroundColor="white"
        borderRadius={10}
        minHeight={disableCopying ? 125 : 250}
      >
        <SheetHandle />
        <Container
          padding={5}
          marginTop={disableCopying ? 4 : 8}
          alignItems="center"
          width="100%"
        >
          <Container maxWidth={230}>
            <Text
              fontFamily="RobotoMono-Regular"
              fontSize={18}
              fontWeight="bold"
            >
              {address.slice(0, 6)}
              <Text
                fontFamily="RobotoMono-Regular"
                fontSize={18}
                fontWeight="normal"
              >
                {address.slice(6, -4)}
              </Text>
              {address.slice(-4)}
            </Text>
          </Container>
          <NetworkBadge marginTop={1} />
          {!disableCopying && (
            <Container
              flexDirection="row"
              justifyContent="center"
              width="100%"
              paddingHorizontal={5}
            >
              <Button
                iconProps={{ name: 'copy' }}
                marginTop={4}
                width="100%"
                onPress={handleCopiedText}
              >
                Copy Address
              </Button>
            </Container>
          )}
        </Container>
      </Container>
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </Container>
  );
};

export default CopyAddressSheet;

import React, { memo, useCallback, useState } from 'react';
import { useRoute } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native';
import {
  ToastPositionContainerHeight,
  CopyToast,
} from '../../../src/components/toasts';
import {
  Container,
  Text,
  SheetHandle,
  NetworkBadge,
  Button,
  Checkbox,
  CenteredContainer,
  IconProps,
} from '@cardstack/components';
import { useClipboard } from '@rainbow-me/hooks';
import { abbreviations } from '@rainbow-me/utils';

interface RouteType {
  params: { address: string; disableCopying?: boolean };
  key: string;
  name: string;
}

const iconProps: IconProps = { name: 'copy' };

const CopyAddressSheet = () => {
  const {
    params: { address, disableCopying },
  } = useRoute<RouteType>();

  const { setClipboard } = useClipboard();
  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);
  const [checked, setChecked] = useState(false);

  const handleCopiedText = useCallback(() => {
    setClipboard(address);
    setCopiedText(abbreviations.formatAddressForDisplay(address));
    setCopyCount(count => count + 1);
  }, [address, setClipboard]);

  const toogleCheckbox = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  return (
    <>
      <Container
        alignItems="center"
        marginHorizontal={5}
        padding={4}
        backgroundColor="white"
        borderRadius={10}
        minHeight={disableCopying ? 125 : 250}
      >
        <SheetHandle />
        {!disableCopying ? (
          <Container flexDirection="row" marginBottom={4} paddingTop={5}>
            <Container flex={1} justifyContent="center">
              <Checkbox isSelected={checked} onPress={toogleCheckbox} />
            </Container>
            <Container flex={4}>
              <TouchableOpacity onPress={toogleCheckbox}>
                <Text fontFamily="OpenSans-Regular" fontSize={14} color="red">
                  I acknowledge that I can only send DAI.CPXD and CARD.CPXD to
                  this address. All other funds may be lost.
                </Text>
              </TouchableOpacity>
            </Container>
          </Container>
        ) : null}
        <CenteredContainer padding={4}>
          <Text
            fontFamily="RobotoMono-Regular"
            fontSize={18}
            fontWeight="bold"
            textAlign="center"
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
          <NetworkBadge marginTop={1} />
          {!disableCopying && (
            <Button
              disablePress={!checked}
              iconProps={iconProps}
              marginTop={4}
              variant={checked ? undefined : 'disabled'}
              maxWidth="70%"
              onPress={handleCopiedText}
            >
              Copy Address
            </Button>
          )}
        </CenteredContainer>
      </Container>
      {copyCount > 0 ? (
        <Container
          zIndex={10}
          position="absolute"
          height={ToastPositionContainerHeight}
          width="100%"
          bottom={ToastPositionContainerHeight + 20}
        >
          <CopyToast copiedText={copiedText} copyCount={copyCount} />
        </Container>
      ) : null}
    </>
  );
};

export default memo(CopyAddressSheet);

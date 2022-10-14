import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback, useState } from 'react';
import { Pressable } from 'react-native';

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
import { delayLongPressMs } from '@cardstack/constants';
import { useCopyToast } from '@cardstack/hooks';
import { RouteType } from '@cardstack/navigation/types';

import { abbreviations } from '@rainbow-me/utils';

interface Params {
  address: string;
  disableCopying?: boolean;
}

const iconProps: IconProps = { name: 'copy' };

const CopyAddressSheet = () => {
  const {
    params: { address, disableCopying },
  } = useRoute<RouteType<Params>>();

  const [checked, setChecked] = useState(false);

  const { copyToClipboard } = useCopyToast({
    dataToCopy: address,
    customCopyLabel: abbreviations.formatAddressForDisplay(address),
  });

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
            <Container flex={1} paddingHorizontal={5} justifyContent="center">
              <Checkbox
                checkboxPosition="left"
                isSelected={checked}
                onPress={toogleCheckbox}
              >
                <Text
                  marginRight={6}
                  fontFamily="OpenSans-Regular"
                  fontSize={14}
                  color="red"
                >
                  I acknowledge that I can only send DAI.CPXD and CARD.CPXD to
                  this address. All other funds may be lost.
                </Text>
              </Checkbox>
            </Container>
          </Container>
        ) : null}
        <CenteredContainer padding={4}>
          <Pressable
            onLongPress={copyToClipboard as any}
            delayLongPress={delayLongPressMs}
          >
            <Text
              fontFamily="RobotoMono-Regular"
              fontSize={18}
              weight="bold"
              textAlign="center"
            >
              {address.slice(0, 6)}
              <Text
                fontFamily="RobotoMono-Regular"
                fontSize={18}
                weight="regular"
              >
                {address.slice(6, -4)}
              </Text>
              {address.slice(-4)}
            </Text>
          </Pressable>
          <NetworkBadge marginTop={1} />
          {!disableCopying && (
            <Button
              disablePress={!checked}
              iconProps={iconProps}
              marginTop={4}
              variant={checked ? undefined : 'disabled'}
              maxWidth="70%"
              onPress={copyToClipboard}
            >
              Copy Address
            </Button>
          )}
        </CenteredContainer>
      </Container>
    </>
  );
};

export default memo(CopyAddressSheet);

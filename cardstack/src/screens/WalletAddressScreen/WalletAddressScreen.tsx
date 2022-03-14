import React, { memo, useMemo } from 'react';
import { strings } from './strings';
import { Container, StyledQRCode, Text, Button } from '@cardstack/components';
import { useAccountProfile } from '@rainbow-me/hooks';
import { getAddressPreview } from '@cardstack/utils';
import { useCopyToast } from '@cardstack/hooks/useCopyToast';

const WalletAddressScreen = () => {
  const { accountAddress } = useAccountProfile();

  const addressPreview = useMemo(() => getAddressPreview(accountAddress), [
    accountAddress,
  ]);

  const { CopyToastComponent, copyToClipboard } = useCopyToast({
    dataToCopy: accountAddress,
    customCopyLabel: addressPreview,
  });

  return (
    <>
      <Container flex={1} alignItems="center" paddingTop={10}>
        <StyledQRCode value={accountAddress} addLogo={false} />
        <Container
          flex={0.3}
          alignItems="center"
          justifyContent="space-around"
          paddingTop={2}
        >
          <Text weight="bold">{getAddressPreview(accountAddress)}</Text>
          <Button onPress={copyToClipboard}>{strings.copyAddressBtn}</Button>
        </Container>
      </Container>
      <CopyToastComponent />
    </>
  );
};

export default memo(WalletAddressScreen);

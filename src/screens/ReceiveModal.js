import { toLower } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import TouchableBackdrop from '../components/TouchableBackdrop';
import ButtonPressAnimation from '../components/animations/ButtonPressAnimation';
import { Centered, Column, ColumnWithMargins } from '../components/layout';
import ShareButton from '../components/qr-code/ShareButton';
import { SheetHandle } from '../components/sheet';
import { CopyToast, ToastPositionContainer } from '../components/toasts';
import { useAccountProfile, useClipboard } from '../hooks';
import { useNavigation } from '../navigation/Navigation';
import { abbreviations, deviceUtils } from '../utils';
import { QRCode, Text, TruncatedAddress } from '@cardstack/components';
import { padding, shadow } from '@rainbow-me/styles';

const QRCodeSize = ios ? 250 : Math.min(230, deviceUtils.dimensions.width - 20);

const Container = styled(Centered).attrs({
  direction: 'column',
})`
  bottom: 16;
  flex: 1;
`;

const QRWrapper = styled(Column).attrs({ align: 'center' })`
  ${padding(24)};
  ${({ theme: { colors } }) =>
    shadow.build(0, 10, 50, colors.shadowBlack, 0.6)};
  background-color: ${({ theme: { colors } }) => colors.whiteLabel};
  border-radius: 39;
`;

const accountAddressSelector = state => state.settings.accountAddress;
const lowercaseAccountAddressSelector = createSelector(
  accountAddressSelector,
  toLower
);

export default function ReceiveModal() {
  const { goBack } = useNavigation();
  const accountAddress = useSelector(lowercaseAccountAddressSelector);
  const { accountName } = useAccountProfile();
  const { setClipboard } = useClipboard();
  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);
  const handleCopiedText = () => {
    setClipboard(accountAddress);
    setCopiedText(abbreviations.formatAddressForDisplay(accountAddress));
    setCopyCount(count => count + 1);
  };

  return (
    <Container testID="receive-modal">
      <TouchableBackdrop onPress={goBack} />
      <ColumnWithMargins align="center" margin={24}>
        <SheetHandle backgroundColor="white" opacity={0.5} />
        <QRWrapper>
          <QRCode size={QRCodeSize} value={accountAddress} />
        </QRWrapper>
        <ButtonPressAnimation onPress={handleCopiedText}>
          <ColumnWithMargins margin={2}>
            <Text
              color="white"
              fontSize={26}
              fontWeight="600"
              textAlign="center"
            >
              {accountName}
            </Text>
            <TruncatedAddress address={accountAddress} color="grayText" />
          </ColumnWithMargins>
        </ButtonPressAnimation>
        <ShareButton accountAddress={accountAddress} />
      </ColumnWithMargins>
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </Container>
  );
}

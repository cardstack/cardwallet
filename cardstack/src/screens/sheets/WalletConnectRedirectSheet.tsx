import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';

import { CenteredContainer, Sheet, Text } from '@cardstack/components';
import { useAppState } from '@cardstack/hooks/useAppState';
import { RouteType } from '@cardstack/navigation/types';

export enum WCRedirectTypes {
  connect = 'connect',
  reject = 'reject',
  sign = 'sign',
  signCanceled = 'signCanceled',
  transaction = 'transaction',
  transactionCanceled = 'transactionCanceled',
  qrcodeInvalid = 'qrcodeInvalid',
}

const titlesMap: Record<WCRedirectTypes, string> = {
  connect: "You're connected!",
  reject: 'Connection canceled',
  sign: 'Message signed!',
  signCanceled: 'Transaction canceled!',
  transaction: 'Transaction sent!',
  transactionCanceled: 'Transaction canceled!',
  qrcodeInvalid: 'The QR Code is invalid or expired!',
};

interface Params {
  type: WCRedirectTypes;
}

const WalletConnectRedirectSheet = () => {
  const { goBack } = useNavigation();
  const { appState } = useAppState();

  const {
    params: { type },
  } = useRoute<RouteType<Params>>();

  useEffect(() => {
    if (appState === 'background' || !type) {
      goBack();
    }
  }, [goBack, appState, type]);

  return (
    <Sheet hideHandle>
      <CenteredContainer paddingTop={3} paddingHorizontal={1}>
        <CenteredContainer>
          <Text color="black" size="large" weight="bold" textAlign="center">
            {titlesMap[type]}
          </Text>
        </CenteredContainer>
        <Text
          color="darkGrayText"
          marginTop={2}
          size="medium"
          textAlign="center"
        >
          {type === WCRedirectTypes.qrcodeInvalid
            ? 'Please scan valid QR Code'
            : 'Go back to your browser'}
        </Text>
      </CenteredContainer>
    </Sheet>
  );
};

export default React.memo(WalletConnectRedirectSheet);

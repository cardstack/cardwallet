import React from 'react';
import { GasSpeedButton } from '../../../src/components/gas';
import { Container, TransactionConfirmationSheet } from '@cardstack/components';
import { useTransactionConfirmationUtils } from '@rainbow-me/hooks';

const TransactionConfirmation = () => {
  const {
    isMessageRequest,
    dappUrl,
    message,
    onCancel,
    onPressSend,
    methodName,
    messageRequest,
    type,
  } = useTransactionConfirmationUtils();

  return (
    <Container flex={1} width="100%">
      <TransactionConfirmationSheet
        dappUrl={dappUrl}
        message={message}
        onCancel={onCancel}
        onPressSend={onPressSend}
        methodName={methodName}
        messageRequest={messageRequest}
        type={type}
      />
      <Container height={150}>
        {!isMessageRequest && (
          <Container>
            <GasSpeedButton type="transaction" />
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default TransactionConfirmation;

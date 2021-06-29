import React from 'react';
import { useTransactionConfirmation } from '@cardstack/hooks';
import { GasSpeedButton } from '../../../src/components/gas';
import { Container, TransactionConfirmationSheet } from '@cardstack/components';

const TransactionConfirmation = () => {
  const {
    decodedData,
    loading,
    isMessageRequest,
    dappUrl,
    message,
    onCancel,
    onConfirm,
    methodName,
    messageRequest,
    type,
  } = useTransactionConfirmation();

  return (
    <Container flex={1} width="100%">
      {!loading && (
        <TransactionConfirmationSheet
          decodedData={decodedData}
          dappUrl={dappUrl}
          message={message}
          onCancel={onCancel}
          onConfirm={onConfirm}
          methodName={methodName}
          messageRequest={messageRequest}
          type={type}
        />
      )}
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

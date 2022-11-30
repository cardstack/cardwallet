import React from 'react';
import { StatusBar } from 'react-native';

import {
  Container,
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';
import { useTransactionConfirmation } from '@cardstack/hooks';

import { GasSpeedButton } from '../../../src/components/gas';

const TransactionConfirmation = () => {
  const {
    data,
    loading,
    isMessageRequest,
    dappUrl,
    message,
    onCancel,
    onConfirm,
    methodName,
    messageRequest,
    isAuthorizing,
  } = useTransactionConfirmation();

  return (
    <SafeAreaView backgroundColor="black" flex={1} width="100%">
      <StatusBar barStyle="light-content" />
      <TransactionConfirmationSheet
        data={data}
        dappUrl={dappUrl}
        message={message}
        onCancel={onCancel}
        onConfirm={onConfirm}
        methodName={methodName}
        loading={loading}
        messageRequest={messageRequest}
        onConfirmLoading={isAuthorizing}
      />
      <Container height={150}>
        {!isMessageRequest && (
          <Container>
            <GasSpeedButton type="transaction" />
          </Container>
        )}
      </Container>
    </SafeAreaView>
  );
};

export default TransactionConfirmation;

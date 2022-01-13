import React from 'react';
import { StatusBar } from 'react-native';
import { GasSpeedButton } from '../../../src/components/gas';
import { useTransactionConfirmation } from '@cardstack/hooks';
import { Device } from '@cardstack/utils';
import {
  Container,
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';

// converted Status bar height that restyle paddingTop prop can understand
const StatusBarHeightInStyle = Math.ceil((StatusBar.currentHeight || 24) / 4);

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
  } = useTransactionConfirmation();

  return (
    <SafeAreaView
      backgroundColor="black"
      flex={1}
      width="100%"
      paddingTop={Device.isAndroid ? StatusBarHeightInStyle : 0}
    >
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

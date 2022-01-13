import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GasSpeedButton } from '../../../src/components/gas';
import { useTransactionConfirmation } from '@cardstack/hooks';
import {
  Container,
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    backgroundColor: 'black',
    flex: 1,
    width: '100%',
    paddingTop: StatusBar.currentHeight || 0,
  },
});

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
    <SafeAreaView style={styles.safeAreaViewStyle}>
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

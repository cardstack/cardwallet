import React from 'react';
import { useTransactionConfirmationSheet } from './useTransactionConfirmationSheet';
import {
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';

const TransactionConfirmation = () => {
  const {
    data,
    loading,
    onCancel,
    onConfirm,
    onConfirmLoading,
  } = useTransactionConfirmationSheet();

  return (
    <SafeAreaView backgroundColor="black" flex={1} width="100%">
      <TransactionConfirmationSheet
        data={data}
        onCancel={onCancel}
        onConfirm={onConfirm}
        loading={loading}
        onConfirmLoading={onConfirmLoading}
      />
    </SafeAreaView>
  );
};

export default TransactionConfirmation;

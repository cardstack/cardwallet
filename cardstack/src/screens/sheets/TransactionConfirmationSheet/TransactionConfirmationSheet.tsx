import React, { memo } from 'react';

import {
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';

import { useTransactionConfirmationSheet } from './useTransactionConfirmationSheet';

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

export default memo(TransactionConfirmation);

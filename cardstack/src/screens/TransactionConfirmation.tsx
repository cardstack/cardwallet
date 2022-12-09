import React from 'react';
import { StatusBar } from 'react-native';

import {
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';
import { useTransactionConfirmation } from '@cardstack/hooks';

const TransactionConfirmation = () => {
  const props = useTransactionConfirmation();

  return (
    <SafeAreaView backgroundColor="black" flex={1} width="100%">
      <StatusBar barStyle="light-content" />
      <TransactionConfirmationSheet {...props} />
    </SafeAreaView>
  );
};

export default TransactionConfirmation;

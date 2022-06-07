import React, { memo } from 'react';

import {
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';

import useRewardsRegister from './useRewardsRegister';

const RewardsRegisterSheet = () => {
  const {
    data,
    onConfirmRegisterPress,
    goBack,
    registerEstimatedGasLoading,
  } = useRewardsRegister();

  return (
    <SafeAreaView backgroundColor="black" flex={1} width="100%">
      <TransactionConfirmationSheet
        data={data}
        onCancel={goBack}
        onConfirm={onConfirmRegisterPress}
        loading={false}
        disabledConfirmButton={registerEstimatedGasLoading}
      />
    </SafeAreaView>
  );
};

export default memo(RewardsRegisterSheet);

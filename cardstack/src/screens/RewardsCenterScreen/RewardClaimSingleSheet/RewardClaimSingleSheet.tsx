import React, { memo } from 'react';

import {
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';

import useRewardClaimSingle from './useRewardClaimSingle';

const RewardClaimSingleSheet = () => {
  const { data, onCancel, onConfirm } = useRewardClaimSingle();

  return (
    <SafeAreaView backgroundColor="black" flex={1} width="100%">
      <TransactionConfirmationSheet
        data={data}
        onCancel={onCancel}
        onConfirm={onConfirm}
        loading={false}
        disabledConfirmButton={data.loadingGasEstimate}
      />
    </SafeAreaView>
  );
};

export default memo(RewardClaimSingleSheet);

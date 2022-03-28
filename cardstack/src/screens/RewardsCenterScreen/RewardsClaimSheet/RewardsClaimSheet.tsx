import React, { memo } from 'react';
import { useRoute } from '@react-navigation/native';
import { RouteType } from '@cardstack/navigation/types';
import { TransactionConfirmationData } from '@cardstack/types';
import {
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';

interface RouteParams {
  data: TransactionConfirmationData;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const RewardsClaimSheet = () => {
  const {
    params: { data, onConfirm, onCancel },
  } = useRoute<RouteType<RouteParams>>();

  return (
    <SafeAreaView backgroundColor="black" flex={1} width="100%">
      <TransactionConfirmationSheet
        data={data}
        onCancel={onCancel}
        onConfirm={onConfirm}
        loading={false}
      />
    </SafeAreaView>
  );
};

export default memo(RewardsClaimSheet);

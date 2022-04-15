import { useRoute } from '@react-navigation/native';
import React, { memo } from 'react';

import {
  TransactionConfirmationSheet,
  SafeAreaView,
} from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';
import { TransactionConfirmationRouteParams } from '@cardstack/types';

const RewardsRegisterSheet = () => {
  const {
    params: { data, onConfirm, onCancel },
  } = useRoute<RouteType<TransactionConfirmationRouteParams>>();

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

export default memo(RewardsRegisterSheet);

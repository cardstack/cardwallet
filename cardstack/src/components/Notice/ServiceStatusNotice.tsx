import React from 'react';
import { Linking } from 'react-native';

import { useGetServiceStatusQuery } from '@cardstack/services';
import { Notice } from '@cardstack/components';

export const ServiceStatusNotice = () => {
  const { data } = useGetServiceStatusQuery(null);

  return (
    <Notice
      isVisible={!!data}
      description={data?.name || 'Test'}
      type="warning"
      onPress={() => {
        Linking.openURL(`https://status.cardstack.com`);
      }}
    />
  );
};

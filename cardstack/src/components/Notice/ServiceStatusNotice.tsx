import React, { useCallback } from 'react';
import { Linking } from 'react-native';

import { Notice } from '@cardstack/components';
import { useGetServiceStatusQuery } from '@cardstack/services';

export const ServiceStatusNotice = () => {
  const { data } = useGetServiceStatusQuery();

  const handleOnPress = useCallback(() => {
    Linking.openURL(`https://status.cardstack.com`);
  }, []);

  return (
    <Notice
      isVisible={!!data}
      description={data?.name || 'Incident reported.'}
      type="warning"
      onPress={handleOnPress}
    />
  );
};

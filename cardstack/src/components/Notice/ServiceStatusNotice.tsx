import React, { useCallback } from 'react';
import { Linking } from 'react-native';

import { Container, Notice } from '@cardstack/components';
import { useGetServiceStatusQuery } from '@cardstack/services';

export const ServiceStatusNotice = () => {
  const { data } = useGetServiceStatusQuery();

  const handleOnPress = useCallback(() => {
    Linking.openURL(`https://status.cardstack.com`);
  }, []);

  return (
    <Container marginHorizontal={4} marginVertical={2}>
      <Notice
        isVisible={!!data}
        description={data?.name || 'Information available.'}
        type="warning"
        onPress={handleOnPress}
      />
    </Container>
  );
};
